/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import scriptHelper = require('../../utility/script/scripthelper');
import localeStore = require('../../stores/locale/localestore');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import ReactDom = require('react-dom');
import moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
import modulekeys = require('../../utility/generic/modulekeys');
import enums = require('../utility/enums');
import markingHelper = require('../../utility/markscheme/markinghelper');
import responseHelper = require('../utility/responsehelper/responsehelper');
import scrollHelper = require('../../utility/markscheme/markschemescrollhelper');
import numericMarkingHelper = require('../../utility/markscheme/numericmarkinghelper');
import nonNumericMarkingHelper = require('../../utility/markscheme/nonnumericmarkinghelper');
import GenericDialog = require('../utility/genericdialog');
import stringHelper = require('../../utility/generic/stringhelper');
import ReactTestUtils = require('react-dom/test-utils');
import markingStore = require('../../stores/marking/markingstore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import worklistStore = require('../../stores/worklist/workliststore');
import constants = require('../utility/constants');
import devicehelper = require('../../utility/touch/devicehelper');
import messageStore = require('../../stores/message/messagestore');
import stampStore = require('../../stores/stamp/stampstore');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import exceptionStore = require('../../stores/exception/exceptionstore');
import ccHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import NRButton = require('./nrbutton');
import onPageCommentHelper = require('../utility/annotation/onpagecommenthelper');
import loggerConstants = require('../utility/loggerhelperconstants');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import useroptionStore = require('../../stores/useroption/useroptionstore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import responseStore = require('../../stores/response/responsestore');
import htmlviewerhelper = require('../utility/responsehelper/htmlviewerhelper');
declare let config: any;


/**
 * Properties of answer item component.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onMoveNext: Function;
    onMovePrev: Function;
    isUpArrowDisabled: boolean;
    isDownArrowDisabled: boolean;
    updateMark: Function;
    selectedQuestionItem: treeViewItem;
    onValidateMarkEntry: Function;
    onEnterKeyPress: Function;
    originalMark: AllocatedMark;
    responseChanged: number;
    onResetConfirm: Function;
    logKeyUsageValues: Function;
    renderedOn: number;
    isResponseEditable: boolean;
    isResetScroll?: boolean;
    isNonNumeric: boolean;
    markingProgress: number;
    treeNodes: treeViewItem;
    isLastNode: boolean;
    onNRButtonClick: Function;
    logMarkEntry: Function;
    scrollHelperInstance: scrollHelper;
    setResponseNavigationFlag: Function;
}

interface State {
    toggle: boolean;
}

/**
 * React component class for SelectedQuestionItem
 */
class SelectedQuestionItem extends pureRenderComponent<Props, State> {

    /** refs */
    public refs: {
        [key: string]: (Element);
        markEntryTextBox: (HTMLInputElement);
    };

    // selected tree node
    private currentItem: treeViewItem;

    // mark entry helper
    private markingHelper: markingHelper;

    // helper class
    private marksSchemeHelper: markSchemeHelper;

    // Markscheme scrolling helper
    private scrollHelper: scrollHelper;

    private mark: AllocatedMark = {
        displayMark: '-', valueMark: null
    };

    // check if the original mark has been changed
    private isDirty: boolean = false;

    // check if onTextChanged is called after an invalid mark entry
    private isFromError: boolean = false;

    private originalMark: AllocatedMark;

    // This is to indicate mark entry textbox is freez for the timebeing.
    private isMarkEntryPanelBusy: boolean = false;

    // Indicate whether the mark entry text box has focus.
    private hasFocus: boolean = false;

    // flag to indicate whether mark by keyboard or button
    private isMarkByKeyboard: boolean = true;

    // holds the value while keydown event triggers
    private previousMark: AllocatedMark = {
        displayMark: '-', valueMark: null
    };

    // Indicate whether the Mark Confirmated or not
    private confirmationForLastMarkScheme: boolean = false;

    private _isTabletOrMobileDevice: boolean = false;

    // Indicate whether the singleDigitMarkWithoutEnter is set from useroption or not.
    private isSingleDigitMarkWithoutEnter: boolean = false;

    private isNavigating: boolean = false;

    /**
     * Returns true if reset button is enabled
     * @returns
     */
    private get isResetButtonEnabled(): boolean {

        return this.markingHelper.isResetEnabled(this.currentItem.allocatedMarks.displayMark);
    }

    /**
     * returns whether google analytics enabled and needs to log in analytics based on
     * isDirty or isMarkByKeyboard
     * @returns
     */
    private get canDoLoggingInGoogleAnalytics(): boolean {
        // checking analytics enabled or not
        // isDirty will be true only if marked by keyboard
        // isMarkByKeyboard setting true initially, will be false once mark button used
        return ((this.isDirty || !this.isMarkByKeyboard));
    }

    /**
     * Return whether next or previous mark scheme is available for marking.
     * @returns next or prvious markable item is ready.
     */
    private get isNextMarkSchemeAvailable(): boolean {

        return (!this.props.isDownArrowDisabled);
    }

    /**
     * Constructor for the Response component
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            toggle: false
        };
        this.marksSchemeHelper = new markSchemeHelper();

        let helper: MarkingValidationHelper;

        if (this.props.isNonNumeric === true) {
            helper = new nonNumericMarkingHelper();
        } else {
            helper = new numericMarkingHelper();
        }

        this.markingHelper = new markingHelper(helper);
        this.scrollHelper = this.props.scrollHelperInstance;
        this.onChange = this.onChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.activateDeactivateListener = this.activateDeactivateListener.bind(this);
        this.selectMarkText = this.selectMarkText.bind(this);
        this.preventPaste = this.preventPaste.bind(this);
        this.onUpArrowClick = this.onUpArrowClick.bind(this);
        this.onDownArrowClick = this.onDownArrowClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onKeyDownHandle = this.onKeyDownHandle.bind(this);
        this.markSchemeScrollReset = this.markSchemeScrollReset.bind(this);
        this._isTabletOrMobileDevice = htmlUtilities.isTabletOrMobileDevice;
        this.setSingleDigitMarkIsWithoutEnter();
    }

    /**
     * Render method of the component
     */
    public render(): JSX.Element {

        let upArrowClass = 'question-nav prev-question-btn light';
        let downArrowClass = 'question-nav next-question-btn light';

        if (this.props.isUpArrowDisabled) {
            upArrowClass = 'question-nav prev-question-btn light disabled';
        }

        if (this.props.isDownArrowDisabled) {
            downArrowClass = 'question-nav next-question-btn light disabled';
        }

        this.resetCurrentItem();

        /* When we navigate away from response and there are marks to save to db, response screen would be shown untill
        * save marks completed. But Marking progress will be immediately set to false. The reset mark button will be hidden.
        in order to avoid that we need to check where we are navigating as well.navigateTo will only be set when navigating
        from open or ingarce response.NR buuton will be visible in the mark entry panel if the markby annoation is enabled.
        */

        let resetMarkButton = (this.props.isResponseEditable) ?
            (<div className='active-question-button-holder'>
                {this.getNRButtonVisibility()}
                <div className='reset-btn-holder'>
                    <button className='rounded reset-btn lite' onClick={this.onResetButtonClicked.bind(this)}
                        title={localeStore.instance.TranslateText('marking.response.mark-scheme-panel.reset-mark-button-tooltip')}
                        disabled={(!this.isResetButtonEnabled)}   >
                        {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.reset-mark-button')}
                    </button>
                </div>
            </div>) : null;

        return (
            <div className='active-question'>
                <a href='javascript:void(0)' className={upArrowClass}
                    title={localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-question-button-tooltip')}
                    onClick={this.onUpArrowClick}>
                    <span className='top-arrow-blue sprite-icon'>
                        {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-question-button-tooltip')}
                    </span>
                </a>
                <a href='javascript:void(0)'
                    className={downArrowClass}
                    title={localeStore.instance.TranslateText('marking.response.mark-scheme-panel.next-question-button-tooltip')}
                    onClick={this.onDownArrowClick}>
                    <span className='bottom-arrow-blue sprite-icon'>
                        {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-question-button-tooltip')}
                    </span>
                </a>
                <div className='active-question-wrapper'>
                    <div className='active-question-holder'>
                        <span className='active-question-text'>{this.currentItem.name}</span>
                        {this.getMarkEntryPanel()}
                    </div>
                    {resetMarkButton}
                </div>
            </div>
        );
    }
    /**
     * When markByAnnotation CC is enabled  and the response is editable, then it will skip the markEntryTextBox.
     */

    private getMarkEntryPanel(): JSX.Element {
        let _displayMark: string;

        if (this.mark.displayMark === constants.NOT_ATTEMPTED) {
            _displayMark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
        } else {
            _displayMark = this.mark.displayMark;
        }

        if (this.props.isResponseEditable &&
            (!responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus))) {
            return (<span className='active-mark'>
                {this.renderLinkIndicator(this.props.selectedQuestionItem.bIndex)}
                <input id='markingPanel' ref={'markEntryTextBox'}
                    type='text' className='active-question-mark'
                    value={_displayMark}
                    onChange={this.onChange}
                    onInput={this.onTextChange}
                    onBlur={this.activateDeactivateListener}
                    onFocus={this.selectMarkText}
                    onPaste={this.preventPaste}
                    spellCheck={false}
                    autoComplete='off'
                    onKeyDown={this.onKeyDownHandle}
                    aria-label='markingPanel'></input>
                <span className='active-mark-slash' >{(this.props.isNonNumeric === true) ? '' : '/'}</span>
                <span className='active-question-total-mark'>{(this.props.isNonNumeric === true) ? '' :
                    this.currentItem.maximumNumericMark}</span>
            </span>);
        } else if (this.props.isResponseEditable &&
            (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus))) {
            return (<span className='active-mark'>
                {this.renderLinkIndicator(this.props.selectedQuestionItem.bIndex)}
                <label className='active-question-mark'>{_displayMark}</label>
                < span className='active-mark-slash'>{(this.props.isNonNumeric === true) ? '' : '/'}</span >
                <span className='active-question-total-mark'>{(this.props.isNonNumeric === true) ? '' :
                    this.currentItem.maximumNumericMark}</span>
            </span>);
        } else {
            return (<span className='active-mark'>
                {this.renderLinkIndicator(this.props.selectedQuestionItem.bIndex)}
                <label className='active-question-mark'>{_displayMark}</label>
                < span className='active-mark-slash'>{(this.props.isNonNumeric === true) ? '' : '/'}</span >
                <span className='active-question-total-mark'>{(this.props.isNonNumeric === true) ? '' :
                    this.currentItem.maximumNumericMark}</span>
            </span>);
        }
    }


    /**
     * Checking the NRButton Visibility based on MarkbyAnnoation CC.
     */
    private getNRButtonVisibility() {
        if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
            return (
                <NRButton
                    onNRButtonClick={this.onNRButtonClick}
                    isDisabled={this.doHideNRbutton()}
                />);
        }
    }

    /**
     * When a new mark has tried to invoke
     * @param {any} e
     */
    private onKeyDownHandle(e: any): void {
        // If markscheme panel is busy by scrolling or confirmation is popup is displayed
        // block any further keyboard mark entry
        if (this.scrollHelper.isMarkSchemeScrolling) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * Preventing pasting texts to mark entry
     * @param {any} e
     */
    private preventPaste(e: any) {
        e.preventDefault();
    }

    /**
     * Upadte NR mark on button click
     */
    private onNRClick(): void {
        let mark: string = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
        // Setting the dirty flag to avoid deleting original mark in textchanded event since this is a button click
        this.isDirty = true;
        // setting flag for logging into google analytics
        this.isMarkByKeyboard = false;
        this.updateMark(mark);
        // resetting the dirty flag
        this.isDirty = false;
        /* removing the focus after updating mark as to prevent the  onscreen key board */
        this.refs.markEntryTextBox.blur();
        this.props.onEnterKeyPress();
    }

    /**
     * Resetting current item to ensure on every page navigation ms should be updated.
     */
    private resetCurrentItem() {

        // This will reset only when the response load for the first time.
        if (this.currentItem === undefined) {
            this.currentItem = this.props.selectedQuestionItem;
            this.mark = this.currentItem.allocatedMarks;
        }
    }

    /**
     * This included to remove React warning message.
     * we are considering HTML5 onInput rather this.
     * @param event
     */
    private onChange(event: any) {
        let isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
        // closing exiting comment box (if it is open).
        if (isCommentBoxOpen) {
            stampActionCreator.showOrHideComment(false);
            return;
        }
    }


    /**
     * Validate entered mark on the fly.
     * @param event
     * @returns
     */
    private onTextChange = (event: any) => {

        // If markscheme panel is busy by scrolling or confirmation is popup is displayed
        // If favorite toolbar is empty and showing first toolbar banner.
        // block any further keyboard mark entry
        if (this.isNavigating || this.scrollHelper.isMarkSchemeScrolling || this.doAllowKeyPress()) {
            return false;
        }

        let isValidEntry: boolean = false;

        // Browser specific.
        let target: any = event.target || event.srcElement;
        let mark: string = target.value;

        let oldMark: string = this.currentItem.allocatedMarks.displayMark;
        // If the original mark has not been changed
        // and the text changed is not called after an invalid mark entry
        // replace the original mark with the new entry
        if (!this.isDirty && !this.isFromError) {

            // As device doesnot hold selection replace the existing mark with the new mark,
            // rather than forcing the user to select the whole text.
            if (this._isTabletOrMobileDevice) {
                mark = mark.replace(this.currentItem.allocatedMarks.displayMark, '');
            }

            // since the original mark has been changed, set the flag
            this.isDirty = true;
        }

        if (this.markingHelper.validationHelper.validateMarks(mark,
            this.props.selectedQuestionItem.stepValue, this.currentItem.availableMarks)) {
            // This is to consider NR shortcut.
            let _mark = this.markingHelper.getMark(mark);
            this.mark = { displayMark: _mark, valueMark: null };

            if (this.markingHelper.isValidMark(_mark)) {
                this.currentItem.allocatedMarks = this.markingHelper.formatMark(_mark, this.currentItem.availableMarks,
                    this.currentItem.stepValue);

                // If resetting mark from an invalid entry and original mark was -
                // we dont need to show the reset message.
                if (this.isFromError === false && this.markingHelper.checkIfResetConfirmationDeleting(_mark)) {

                    // when the previous mark is 'n' while deleting mark,since it is invalid so
                    // reassign originalMark to this.previousMark. so that we can set the value back
                    // while clicking NO in ResetConfirmation Popup.
                    this.previousMark = this.previousMark.displayMark.toLowerCase() === 'n' ? this.originalMark : this.previousMark;

                    this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED,
                        loggerConstants.MARKENTRY_TYPE_MARK_DELETED,
                        oldMark,
                        this.previousMark.displayMark);

                    this.mark = this.previousMark;

                    // Defect 35124 fix - in IE textbox become blank when reset mark via keyboard, so re-render to show the current mark
                    this.setState({ toggle: !this.state.toggle });

                    // shows the popup when the mark value is ""(empty)
                    // this popup will reset both marks and annotation
                    if (htmlviewerhelper.isHtmlComponent) {
                        this.props.onResetConfirm(false, this.previousMark);
                    } else {
                        this.props.onResetConfirm(true, this.previousMark);
                    }
                    return;
                } else if (this.isFromError === false && this.markingHelper.checkIfResetConfirmation(this.mark.displayMark)) {
                    // shows the popup when the mark value is "-"
                    // this popup will reset only annotation because marks already reseted
                    this.props.onResetConfirm(false);
                }

                //Avoid navigation when mark value is '-'
                if (_mark === '-') {
                    this.props.setResponseNavigationFlag();
                }

                this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED,
                    loggerConstants.MARKENTRY_ACTION_TYPE_TEXTCHANGED,
                    oldMark,
                    this.mark.displayMark);

                // Update to the collection.
                this.props.updateMark();
                /* updating mark edited flag to store */
                if (this.isFromError) {
                    markingActionCreator.markEdited(false);
                } else {
                    markingActionCreator.markEdited(true);
                }

                // if we are resetting the mark after showing an invalid mark entry error popup
                // if the mark scheme accepts only single digit mark (ie no decimal and negative values as well)
                // if the mark has not been deleted, then navigate to the next mark scheme automatically
                if (!this.isFromError &&
                    (this.currentItem.isSingleDigitMark ||
                        (!this.isNextMarkSchemeAvailable && responseHelper.isMbQSelected)) &&
                    this.mark.displayMark.trim() !== constants.NOT_MARKED &&
                    this.mark.displayMark.trim() !== constants.NO_MARK &&
                    this.isSingleDigitMarkWithoutEnter) {

                    /* updating the new mark to store
                    always freeze the textbox while single ms entry.*/
                    if (!responseHelper.isMbQSelected) {
                        this.scrollHelper.navigateMarkSchemeOnDemand(true, this.props.markingProgress);
                    }
                }
            }
            this.isFromError = false;

            // Changing the state to reflect the entered value
            this.setState({ toggle: !this.state.toggle });

            // Go with the current value
            isValidEntry = true;
        } else {
            // we are resetting the mark entry input panel with the original mark
            // set the flag to false
            this.isDirty = false;

            // we are setting the original mark here, then the textChanged event will be called again
            // setting the flag in order to avoid the same
            this.isFromError = true;

            // Show the invalid entry popup
            this.props.onValidateMarkEntry(this.currentItem.minimumNumericMark,
                this.currentItem.maximumNumericMark, this.props.isNonNumeric);

            this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED,
                loggerConstants.MARKENTRY_TYPE_INVALIDMARK,
                oldMark,
                mark);

            if (this.isNextMarkSchemeAvailable === false && this.confirmationForLastMarkScheme) {
                // updating the mark panel with the previous mark only after the mark confirmation and required only for the last mark
                this.updateMark(this.previousMark.displayMark);
            } else {
                // updating the mark panel with the original mark
                this.updateMark(this.originalMark.displayMark);
            }
        }
        this.confirmationForLastMarkScheme = false;
        return isValidEntry;
    };

    /**
     * Triggers when the marking text panel loses the focus
     * then activate the global marking handler to continue marking.
     */
    private activateDeactivateListener(event: any) {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, true);
        this.hasFocus = false;
    }

    /**
     * If input text has current focus we dont need global handler
     * textbox itself will hanle it
     */
    private selectMarkText() {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, false);
        this.hasFocus = true;
    }

    /**
     * down arrow click event
     */
    private onDownArrowClick(): void {
        if (!this.props.isDownArrowDisabled) {
            this.props.onMoveNext();
        }
    }

    /**
     * up arrow click event
     */
    private onUpArrowClick(): void {
        this.props.onMovePrev();
    }

    /**
     * Attaching key down event on component mount
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_UPDATED_EVENT, this.markUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS, this.enterNRForUnMarkedItems);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_SCHEME_SCROLL_ACTION, this.markSchemeScrollReset);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_MARK_ENTRY_SELECTION, this.removeMarkEntrySelection);
        markingStore.instance.addListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT,
            this.onEnhancedOffPageCommentUpdateCompleted);

        useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT,
            this.setSingleDigitMarkIsWithoutEnter);
        stampStore.instance.addListener(stampStore.StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT, this.setFocusOnMarkEntryTextbox);

        /** Hooking the key press event only if response open in marking mode */
        // Mount the handler
        let handler: moduleKeyHandler =
            new moduleKeyHandler(modulekeys.MARKSCHEME_TEXT_ENTRY,
                enums.Priority.Third,
                true,
                this.handleKeyPress,
                enums.KeyMode.press);

        let scrollHandler: moduleKeyHandler =
            new moduleKeyHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL,
                enums.Priority.Third,
                true,
                this.handleKeyDown,
                enums.KeyMode.down);

        // Hooking the events
        keyDownHelper.instance.mountKeyDownHandler(scrollHandler);
        keyDownHelper.instance.mountKeyPressHandler(handler);
        markingStore.instance.addListener(
            markingStore.MarkingStore.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_EVENT, this.navigateToNextQuestionItem);

    }

    /**
     * Removing key down event handlers on component unmount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_UPDATED_EVENT, this.markUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS, this.enterNRForUnMarkedItems);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_SCHEME_SCROLL_ACTION, this.markSchemeScrollReset);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT,
            this.onEnhancedOffPageCommentUpdateCompleted);
        keyDownHelper.instance.unmountKeyHandler(modulekeys.MARKSCHEME_TEXT_ENTRY);
        keyDownHelper.instance.unmountKeyHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_MARK_ENTRY_SELECTION, this.removeMarkEntrySelection);
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT,
            this.setSingleDigitMarkIsWithoutEnter);
        stampStore.instance.removeListener(stampStore.StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT, this.setFocusOnMarkEntryTextbox);
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_EVENT, this.navigateToNextQuestionItem);

    }

    /**
     * Re rendering the questionitem component after the enhancedoffpagecomment is saved
     */
    private onEnhancedOffPageCommentUpdateCompleted = () => {
        this.setState({ toggle: !this.state.toggle });
    };


    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.selectedQuestionItem !== nextProps.selectedQuestionItem) {
            this.originalMark = nextProps.selectedQuestionItem.allocatedMarks;
            if (onPageCommentHelper.isCommentsSideViewEnabled) {
                stampActionCreator.renderSideViewComments();
            }
        }
        // Response change is valid to check if the first ms is selected
        // on the initial load/navigation the mark should be updated.
        if ((this.currentItem === undefined || this.currentItem.uniqueId !== nextProps.selectedQuestionItem.uniqueId)
            || (this.props.responseChanged !== nextProps.responseChanged)) {

            // checking whether google analytics is enabled.
            // logging marking behavior ie, by key press or button click
            if (this.canDoLoggingInGoogleAnalytics) {
                this.props.logKeyUsageValues(this.isMarkByKeyboard);
                // reseting the isMarkByKeyboard value after logging.
                // it ensures isMarkByKeyboard is true by default
                this.isMarkByKeyboard = true;
            }
            this.isDirty = false;
            this.currentItem = nextProps.selectedQuestionItem;
            this.mark = nextProps.selectedQuestionItem.allocatedMarks;
            this.originalMark = nextProps.selectedQuestionItem.allocatedMarks;

            // Resetting the scroll value to false to allow mark entry
            // once the navigation has been completed
            this.scrollHelper.resetScroll(false);
            this.isNavigating = false;
        }

        if (nextProps.isResetScroll) {
            // Resetting the scroll value to false to allow mark entry
            // once the navigation has been completed
            this.scrollHelper.resetScroll(false);
        }

        if (!messageStore.instance.isMessagePanelVisible && !exceptionStore.instance.isExceptionPanelVisible) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        }
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {

        if (this.isDirty === false && this.refs.markEntryTextBox) {
            this.setMarkEntryBoxSelected(false);
        }
    }

    /**
     * Setting the variable value once the useroption value has changed.
     */
    private setSingleDigitMarkIsWithoutEnter = (): void => {
        this.isSingleDigitMarkWithoutEnter = userOptionsHelper.getUserOptionByName
            (userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER) === 'true' ? true : false;
    }

    /**
     * Handling mark updated event
     */
    private markUpdated = (): void => {
        let isSingleDigitMarkScheme: boolean = this.currentItem.isSingleDigitMark;
        // Setting the dirty flag to avoid deleting original mark in textchanded event since this is a button click
        this.isDirty = true;
        // setting flag for logging into google analytics
        this.isMarkByKeyboard = false;
        this.updateMark(markingStore.instance.newMark.displayMark.toString(), true, false);
        // Log assigning new mark using mark button.
        this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED,
            loggerConstants.MARKENTRY_ACTION_TYPE_MARK_BUTTON_ASSIGN,
            this.currentItem.allocatedMarks.displayMark,
            markingStore.instance.newMark.displayMark);

        // resetting the dirty flag
        this.isDirty = false;

        // if the selected item is a sigle digit mark mark scheme, if a mark button is pressed against the mark scheme
        // the update mark will trigger the onTextChanged event which will trigger the next mark scheme navigation
        // hence no need to trigger another navigation as well. so trigger this if the mark scheme is not a single digit mark
        // mark scheme.
        if (!isSingleDigitMarkScheme || !this.isSingleDigitMarkWithoutEnter) {
            this.setSelectedQuestionItemIndex();
            if (this.marksSchemeHelper.isLastResponseLastQuestion) {
                this.scrollHelper.navigateMarkSchemeOnDemand(this.isNextMarkSchemeAvailable, this.props.markingProgress);
                return;
            }
            this.scrollHelper.navigateMarkSchemeOnDemand(this.isNextMarkSchemeAvailable, this.props.markingProgress);
        }
    };

    /**
     * Enters NR for the selected mark scheme, if it doesnt have a mark allocated to it.
     */
    private enterNRForUnMarkedItems = (): void => {
        if (this.mark.displayMark === constants.NO_MARK || this.mark.displayMark === constants.NOT_MARKED) {
            this.mark = { displayMark: constants.NOT_ATTEMPTED, valueMark: null };
            this.setState({ toggle: !this.state.toggle });
        }
    };

    /**
     * Handles the markscheme panel navigation.
     * @param {KeyboardEvent} event
     */
    private handleKeyDown(event: KeyboardEvent): boolean {
        if (this.doAllowKeyPress()) {
            return true;
        }

        // this variable value is used to restore the value if the user
        // clicks NO in resetConfirmation popup
        this.previousMark = this.mark;
        /* if mark is empty then no transition should happen */
        if (event.keyCode === enums.KeyCode.enter && (((this.mark) ? (this.mark.displayMark).trim() : '') === '-'
            || this.mark.displayMark.trim() === '')) {
            return true;
        }

        /* if mark entered is 'n' and NR defined for the mark scheme, then no transition should happen.
           And also show the invalid mark entry pop and log the mark entry.*/
        if (event.keyCode === enums.KeyCode.enter &&
            (this.mark && this.mark.displayMark.trim().toLowerCase() === 'n') &&
            this.marksSchemeHelper.isAllowNRDefinedForTheMarkScheme) {
            if (this.mark.displayMark.trim().length < constants.NOT_ATTEMPTED.length) {
                // we are resetting the mark entry input panel with the original mark
                // set the flag to false
                this.isDirty = false;

                // we are setting the original mark here, then the textChanged event will be called again
                // setting the flag in order to avoid the same
                this.isFromError = true;
                // Show the invalid entry popup
                this.props.onValidateMarkEntry(this.currentItem.minimumNumericMark,
                    this.currentItem.maximumNumericMark, this.props.isNonNumeric);

                let oldMark: string = this.currentItem.allocatedMarks.displayMark;
                this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED,
                    loggerConstants.MARKENTRY_TYPE_INVALIDMARK,
                    oldMark,
                    this.mark);

                if (this.isNextMarkSchemeAvailable === false && this.confirmationForLastMarkScheme) {
                    /* updating the mark panel with the previous mark only after the mark confirmation
                       and required only for the last mark */
                    this.updateMark(this.previousMark.displayMark);
                } else {
                    // updating the mark panel with the original mark
                    this.updateMark(this.originalMark.displayMark);
                }
                return true;
            }
        }

        // Handle down and up arrow and enter key to navigate
        // Show popup only for responses in editable mode.
        if (event.keyCode === enums.KeyCode.enter && markerOperationModeFactory.operationMode.isResponseEditable) {
            markingActionCreator.showMarkConfirmationPopupOnEnter(event);
        } else {
            return this.navigateToNextQuestionItem(event);
        }
    }

    /**
     * This is to invoke the textbox input event to start the validation.
     */
    private triggerMarkValueUpdatedEvent(): void {

        // React recommented way to notify the textchange.
        ReactTestUtils.Simulate.input(this.refs.markEntryTextBox);
    }

    /**
     * Update the mark in mark text panel and set the focus to continue marking.
     * @param {string} mark
     * @param {boolean} triggerUpdate
     * @param {boolean} doFocus
     */
    private updateMark(mark: string, triggerUpdate: boolean = true, doFocus: boolean = true): void {

        if (!responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
            // For touch device mark by mark button we dont need to give focus
            // to text box avoid device keyboard
            if (doFocus === true) {
                this.refs.markEntryTextBox.focus();
            }

            this.refs.markEntryTextBox.value = mark;
        }

        if (triggerUpdate === true) {
            this.triggerMarkValueUpdatedEvent();
        }
    }

    /**
     * Handle key press event.
     * @param event
     */
    private handleKeyPress(event: KeyboardEvent): boolean {
        // If the response not in marking mode or marking check mode key press won't work.
        // If favorite toolbar is empty and showing first toolbar banner.
        // block any further keyboard mark entry
        let target = event.target as Element;
        if (target && target.id === 'submitSingleResponse_submitSingleResponse' && event.keyCode === 13) {
            return;
        }
        if (!markingStore.instance.isMarkingInProgress
            || worklistStore.instance.isMarkingCheckMode
            || this.doAllowKeyPress() ) {
            return true;
        }
        // To filter the functional keypress.
        if (!this.markingHelper.isFunctionalKeys(event.keyCode)) {
            keyDownHelper.KeydownHelper.stopEvent(event);

            // We are listening to global handler only if we lost focus. Once we have focus,
            // we can continue with text box's own keypress.
            keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, false);
            let resultText = this.markingHelper.getTextValue(event.keyCode || event.charCode, '');
            this.updateMark(resultText);

            return true;
        }
    }

    /**
     * Reset marks and annotation associated to the current markscheme
     * @param {Event} event
     */
    private onResetButtonClicked(event: Event): void {

        this.props.onResetConfirm(true);
    }

    /**
     * Resetting the scroll value to false to allow mark entry
     */
    private markSchemeScrollReset(): void {
        if (this.isNextMarkSchemeAvailable === false) {
            this.scrollHelper.resetScroll(false);
            this.confirmationForLastMarkScheme = true;
        }
    }

    /**
     * Set mark entybox selected
     */
    private setMarkEntryBoxSelected = (isCommentSelected: boolean): void => {
        // For device selecting the mark entry textbox is disabled
        // for preventing unwanted popup of device keyboard popup.
        if (this._isTabletOrMobileDevice) {
            this.scrollHelper.resetScroll(false);
            return;
        }

        // skip selection when comment box is selected
        if (this.refs.markEntryTextBox && !isCommentSelected) {
            this.refs.markEntryTextBox.select();
            this.scrollHelper.resetScroll(false);
        }
    };

    /**
     * Remove mark entrybox selection
     */
    private removeMarkEntrySelection = (): void => {

        // For device selecting the mark entry textbox is disabled
        // for preventing unwanted popup of device keyboard popup.
        if (this._isTabletOrMobileDevice) {
            return;
        }

        // skip selection when comment box is selected
        if (this.refs.markEntryTextBox) {
            this.refs.markEntryTextBox.blur();
        }
    };

    /**
     * set the index of the selected question item
     */
    private setSelectedQuestionItemIndex() {
        if (!markSchemeHelper.isNextResponseAvailable && !this.props.isLastNode) {
            let nextNode = this.marksSchemeHelper.getMarkableItemByDirection(
                this.props.treeNodes,
                this.props.selectedQuestionItem.nextIndex,
                enums.MarkSchemeNavigationDirection.Forward);
            if (nextNode) {
                markingActionCreator.setSelectedQuestionItemIndex(nextNode.bIndex, nextNode.uniqueId);
            }
        } else if (this.props.treeNodes.markSchemeCount === 1){
            /* resetting the navigating variable to false only for the single markscheme tree nodes. Defect#72070 */
            this.isNavigating = false;
        }
    }

    /**
     * Click event for NR button click
     */
    private onNRButtonClick = (e: any): void => {
        e.preventDefault();
        this.props.onNRButtonClick();
    };

    /*
     * Determines to show NR button.
     */
    private doHideNRbutton = (): boolean => {
        /* If allowNR is defined for the item then button needs to be shown */
        if (this.marksSchemeHelper.isAllowNRDefinedForTheMarkScheme) {
            /* If the question is unmarked then show the button */
            return !(this.mark.displayMark === constants.NOT_MARKED
                || this.mark.displayMark === constants.NOT_ATTEMPTED);
        } else {
            return true;
        }
    };

    /*
     * Refresh the selected question item when navigated to next markscheme
     */
    private onQuestionItemChanged = (): void => {
        this.setState({ toggle: !this.state.toggle });
    };

    /*
     * Returns true is marking overlay is visible.
     */
    private doAllowKeyPress = (): boolean => {
        if ((standardisationSetupStore.instance.isUnClassifiedWorklist &&
            !markerOperationModeFactory.operationMode.isResponseEditable) ||
            standardisationSetupStore.instance.isSelectResponsesWorklist) {
            return true;
        } else {
            return (stampStore.instance.isFavouriteToolbarEmpty
                && !eCourseworkHelper.isDigitalFile()
                && !this.props.selectedQuestionItem.isUnZonedItem
                && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner
                // Added this condition as part of defect fix #64943
                && worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
                && !markerOperationModeFactory.operationMode.isTeamManagementMode
                && responseStore.instance.markingMethod !== enums.MarkingMethod.MarkFromObject);
        }
    }

    /**
     * Set focus on mark entry text box.
     */
    private setFocusOnMarkEntryTextbox = (): void => {
        if (!this._isTabletOrMobileDevice) {
            this.refs.markEntryTextBox.focus();
        }
    }

    /**
     * return jsx element to render link indicator
     * @param bIndex
     */
    private renderLinkIndicator(bIndex: number): JSX.Element {
        let doRenderLinkIndicator = markSchemeHelper.doRenderLinkIndicator(
            markSchemeHelper.getLinkableMarkschemeId(this.props.selectedQuestionItem, this.props.treeNodes));
        if (doRenderLinkIndicator) {
            let toolTip = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.link-indicator-tooltip');
            let linkIndicatorId = 'selected_question_link_icon_' + bIndex.toString();
            return markSchemeHelper.renderLinkIndicator(linkIndicatorId, toolTip);
        }
    }

    /**
     * Method to navigate to next question based on key press.
     * @param event
     */
    private navigateToNextQuestionItem = (event: KeyboardEvent): boolean => {

        let handled: boolean = false;

        if (event.keyCode === enums.KeyCode.enter) {
            this.isNavigating = true;
            this.setSelectedQuestionItemIndex();
        }

        let target = event.target as Element;
        if (target && target.id === 'submitSingleResponse_submitSingleResponse' && event.keyCode === 13) {
            return;
        }
        if (this.scrollHelper.doScroll(event.keyCode, this.props.isUpArrowDisabled, this.props.isDownArrowDisabled) === true) {
            handled = true;
        }

        if (!responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
            // Handling backspace and delete key
            // Delete and backspace needs to process only for open response in marking mode
            if (handled === false && markingStore.instance.isMarkingInProgress &&
                !worklistStore.instance.isMarkingCheckMode && this.refs.markEntryTextBox) {

                if (this.hasFocus === false) {
                    let result = this.markingHelper.processSpecialKeys(event.keyCode || event.charCode, this.refs.markEntryTextBox.value);

                    // If the user has selected backspace, we dont need to update the mark
                    if (result[1] === true && result[0] !== this.refs.markEntryTextBox.value) {

                        // If the use has been removed text we dont need to trigger the validate
                        this.updateMark(result[0]);
                    }

                    handled = result[1];
                }
            }
        } else {
            handled = true;
        }

        // This will prevent response navigation throgh keyboard.
        if (handled === true) {
            /* not preventing default for left and right key down events */
            if (event.keyCode === enums.KeyCode.left || event.keyCode === enums.KeyCode.right) {
                keyDownHelper.KeydownHelper.stopEvent(event, false);
            } else if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)
                && (event.keyCode === enums.KeyCode.enter)) {
                keyDownHelper.KeydownHelper.stopEvent(event, false);
            } else {
                keyDownHelper.KeydownHelper.stopEvent(event, true);
            }
        }
        return handled;
    }
}

export = SelectedQuestionItem;