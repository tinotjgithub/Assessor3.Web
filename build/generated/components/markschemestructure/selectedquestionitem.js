"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
var modulekeys = require('../../utility/generic/modulekeys');
var enums = require('../utility/enums');
var markingHelper = require('../../utility/markscheme/markinghelper');
var responseHelper = require('../utility/responsehelper/responsehelper');
var numericMarkingHelper = require('../../utility/markscheme/numericmarkinghelper');
var nonNumericMarkingHelper = require('../../utility/markscheme/nonnumericmarkinghelper');
var ReactTestUtils = require('react-dom/test-utils');
var markingStore = require('../../stores/marking/markingstore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var worklistStore = require('../../stores/worklist/workliststore');
var constants = require('../utility/constants');
var messageStore = require('../../stores/message/messagestore');
var stampStore = require('../../stores/stamp/stampstore');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var exceptionStore = require('../../stores/exception/exceptionstore');
var NRButton = require('./nrbutton');
var onPageCommentHelper = require('../utility/annotation/onpagecommenthelper');
var loggerConstants = require('../utility/loggerhelperconstants');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var useroptionStore = require('../../stores/useroption/useroptionstore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var responseStore = require('../../stores/response/responsestore');
var htmlviewerhelper = require('../utility/responsehelper/htmlviewerhelper');
/**
 * React component class for SelectedQuestionItem
 */
var SelectedQuestionItem = (function (_super) {
    __extends(SelectedQuestionItem, _super);
    /**
     * Constructor for the Response component
     * @param props
     * @param state
     */
    function SelectedQuestionItem(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.mark = {
            displayMark: '-', valueMark: null
        };
        // check if the original mark has been changed
        this.isDirty = false;
        // check if onTextChanged is called after an invalid mark entry
        this.isFromError = false;
        // This is to indicate mark entry textbox is freez for the timebeing.
        this.isMarkEntryPanelBusy = false;
        // Indicate whether the mark entry text box has focus.
        this.hasFocus = false;
        // flag to indicate whether mark by keyboard or button
        this.isMarkByKeyboard = true;
        // holds the value while keydown event triggers
        this.previousMark = {
            displayMark: '-', valueMark: null
        };
        // Indicate whether the Mark Confirmated or not
        this.confirmationForLastMarkScheme = false;
        this._isTabletOrMobileDevice = false;
        // Indicate whether the singleDigitMarkWithoutEnter is set from useroption or not.
        this.isSingleDigitMarkWithoutEnter = false;
        this.isNavigating = false;
        /**
         * Validate entered mark on the fly.
         * @param event
         * @returns
         */
        this.onTextChange = function (event) {
            // If markscheme panel is busy by scrolling or confirmation is popup is displayed
            // If favorite toolbar is empty and showing first toolbar banner.
            // block any further keyboard mark entry
            if (_this.isNavigating || _this.scrollHelper.isMarkSchemeScrolling || _this.doAllowKeyPress()) {
                return false;
            }
            var isValidEntry = false;
            // Browser specific.
            var target = event.target || event.srcElement;
            var mark = target.value;
            var oldMark = _this.currentItem.allocatedMarks.displayMark;
            // If the original mark has not been changed
            // and the text changed is not called after an invalid mark entry
            // replace the original mark with the new entry
            if (!_this.isDirty && !_this.isFromError) {
                // As device doesnot hold selection replace the existing mark with the new mark,
                // rather than forcing the user to select the whole text.
                if (_this._isTabletOrMobileDevice) {
                    mark = mark.replace(_this.currentItem.allocatedMarks.displayMark, '');
                }
                // since the original mark has been changed, set the flag
                _this.isDirty = true;
            }
            if (_this.markingHelper.validationHelper.validateMarks(mark, _this.props.selectedQuestionItem.stepValue, _this.currentItem.availableMarks)) {
                // This is to consider NR shortcut.
                var _mark = _this.markingHelper.getMark(mark);
                _this.mark = { displayMark: _mark, valueMark: null };
                if (_this.markingHelper.isValidMark(_mark)) {
                    _this.currentItem.allocatedMarks = _this.markingHelper.formatMark(_mark, _this.currentItem.availableMarks, _this.currentItem.stepValue);
                    // If resetting mark from an invalid entry and original mark was -
                    // we dont need to show the reset message.
                    if (_this.isFromError === false && _this.markingHelper.checkIfResetConfirmationDeleting(_mark)) {
                        // when the previous mark is 'n' while deleting mark,since it is invalid so
                        // reassign originalMark to this.previousMark. so that we can set the value back
                        // while clicking NO in ResetConfirmation Popup.
                        _this.previousMark = _this.previousMark.displayMark.toLowerCase() === 'n' ? _this.originalMark : _this.previousMark;
                        _this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED, loggerConstants.MARKENTRY_TYPE_MARK_DELETED, oldMark, _this.previousMark.displayMark);
                        _this.mark = _this.previousMark;
                        // Defect 35124 fix - in IE textbox become blank when reset mark via keyboard, so re-render to show the current mark
                        _this.setState({ toggle: !_this.state.toggle });
                        // shows the popup when the mark value is ""(empty)
                        // this popup will reset both marks and annotation
                        if (htmlviewerhelper.isHtmlComponent) {
                            _this.props.onResetConfirm(false, _this.previousMark);
                        }
                        else {
                            _this.props.onResetConfirm(true, _this.previousMark);
                        }
                        return;
                    }
                    else if (_this.isFromError === false && _this.markingHelper.checkIfResetConfirmation(_this.mark.displayMark)) {
                        // shows the popup when the mark value is "-"
                        // this popup will reset only annotation because marks already reseted
                        _this.props.onResetConfirm(false);
                    }
                    //Avoid navigation when mark value is '-'
                    if (_mark === '-') {
                        _this.props.setResponseNavigationFlag();
                    }
                    _this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED, loggerConstants.MARKENTRY_ACTION_TYPE_TEXTCHANGED, oldMark, _this.mark.displayMark);
                    // Update to the collection.
                    _this.props.updateMark();
                    /* updating mark edited flag to store */
                    if (_this.isFromError) {
                        markingActionCreator.markEdited(false);
                    }
                    else {
                        markingActionCreator.markEdited(true);
                    }
                    // if we are resetting the mark after showing an invalid mark entry error popup
                    // if the mark scheme accepts only single digit mark (ie no decimal and negative values as well)
                    // if the mark has not been deleted, then navigate to the next mark scheme automatically
                    if (!_this.isFromError &&
                        (_this.currentItem.isSingleDigitMark ||
                            (!_this.isNextMarkSchemeAvailable && responseHelper.isMbQSelected)) &&
                        _this.mark.displayMark.trim() !== constants.NOT_MARKED &&
                        _this.mark.displayMark.trim() !== constants.NO_MARK &&
                        _this.isSingleDigitMarkWithoutEnter) {
                        /* updating the new mark to store
                        always freeze the textbox while single ms entry.*/
                        if (!responseHelper.isMbQSelected) {
                            _this.scrollHelper.navigateMarkSchemeOnDemand(true, _this.props.markingProgress);
                        }
                    }
                }
                _this.isFromError = false;
                // Changing the state to reflect the entered value
                _this.setState({ toggle: !_this.state.toggle });
                // Go with the current value
                isValidEntry = true;
            }
            else {
                // we are resetting the mark entry input panel with the original mark
                // set the flag to false
                _this.isDirty = false;
                // we are setting the original mark here, then the textChanged event will be called again
                // setting the flag in order to avoid the same
                _this.isFromError = true;
                // Show the invalid entry popup
                _this.props.onValidateMarkEntry(_this.currentItem.minimumNumericMark, _this.currentItem.maximumNumericMark, _this.props.isNonNumeric);
                _this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED, loggerConstants.MARKENTRY_TYPE_INVALIDMARK, oldMark, mark);
                if (_this.isNextMarkSchemeAvailable === false && _this.confirmationForLastMarkScheme) {
                    // updating the mark panel with the previous mark only after the mark confirmation and required only for the last mark
                    _this.updateMark(_this.previousMark.displayMark);
                }
                else {
                    // updating the mark panel with the original mark
                    _this.updateMark(_this.originalMark.displayMark);
                }
            }
            _this.confirmationForLastMarkScheme = false;
            return isValidEntry;
        };
        /**
         * Re rendering the questionitem component after the enhancedoffpagecomment is saved
         */
        this.onEnhancedOffPageCommentUpdateCompleted = function () {
            _this.setState({ toggle: !_this.state.toggle });
        };
        /**
         * Setting the variable value once the useroption value has changed.
         */
        this.setSingleDigitMarkIsWithoutEnter = function () {
            _this.isSingleDigitMarkWithoutEnter = userOptionsHelper.getUserOptionByName(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER) === 'true' ? true : false;
        };
        /**
         * Handling mark updated event
         */
        this.markUpdated = function () {
            var isSingleDigitMarkScheme = _this.currentItem.isSingleDigitMark;
            // Setting the dirty flag to avoid deleting original mark in textchanded event since this is a button click
            _this.isDirty = true;
            // setting flag for logging into google analytics
            _this.isMarkByKeyboard = false;
            _this.updateMark(markingStore.instance.newMark.displayMark.toString(), true, false);
            // Log assigning new mark using mark button.
            _this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED, loggerConstants.MARKENTRY_ACTION_TYPE_MARK_BUTTON_ASSIGN, _this.currentItem.allocatedMarks.displayMark, markingStore.instance.newMark.displayMark);
            // resetting the dirty flag
            _this.isDirty = false;
            // if the selected item is a sigle digit mark mark scheme, if a mark button is pressed against the mark scheme
            // the update mark will trigger the onTextChanged event which will trigger the next mark scheme navigation
            // hence no need to trigger another navigation as well. so trigger this if the mark scheme is not a single digit mark
            // mark scheme.
            if (!isSingleDigitMarkScheme || !_this.isSingleDigitMarkWithoutEnter) {
                _this.setSelectedQuestionItemIndex();
                if (_this.marksSchemeHelper.isLastResponseLastQuestion) {
                    _this.scrollHelper.navigateMarkSchemeOnDemand(_this.isNextMarkSchemeAvailable, _this.props.markingProgress);
                    return;
                }
                _this.scrollHelper.navigateMarkSchemeOnDemand(_this.isNextMarkSchemeAvailable, _this.props.markingProgress);
            }
        };
        /**
         * Enters NR for the selected mark scheme, if it doesnt have a mark allocated to it.
         */
        this.enterNRForUnMarkedItems = function () {
            if (_this.mark.displayMark === constants.NO_MARK || _this.mark.displayMark === constants.NOT_MARKED) {
                _this.mark = { displayMark: constants.NOT_ATTEMPTED, valueMark: null };
                _this.setState({ toggle: !_this.state.toggle });
            }
        };
        /**
         * Set mark entybox selected
         */
        this.setMarkEntryBoxSelected = function (isCommentSelected) {
            // For device selecting the mark entry textbox is disabled
            // for preventing unwanted popup of device keyboard popup.
            if (_this._isTabletOrMobileDevice) {
                _this.scrollHelper.resetScroll(false);
                return;
            }
            // skip selection when comment box is selected
            if (_this.refs.markEntryTextBox && !isCommentSelected) {
                _this.refs.markEntryTextBox.select();
                _this.scrollHelper.resetScroll(false);
            }
        };
        /**
         * Remove mark entrybox selection
         */
        this.removeMarkEntrySelection = function () {
            // For device selecting the mark entry textbox is disabled
            // for preventing unwanted popup of device keyboard popup.
            if (_this._isTabletOrMobileDevice) {
                return;
            }
            // skip selection when comment box is selected
            if (_this.refs.markEntryTextBox) {
                _this.refs.markEntryTextBox.blur();
            }
        };
        /**
         * Click event for NR button click
         */
        this.onNRButtonClick = function (e) {
            e.preventDefault();
            _this.props.onNRButtonClick();
        };
        /*
         * Determines to show NR button.
         */
        this.doHideNRbutton = function () {
            /* If allowNR is defined for the item then button needs to be shown */
            if (_this.marksSchemeHelper.isAllowNRDefinedForTheMarkScheme) {
                /* If the question is unmarked then show the button */
                return !(_this.mark.displayMark === constants.NOT_MARKED
                    || _this.mark.displayMark === constants.NOT_ATTEMPTED);
            }
            else {
                return true;
            }
        };
        /*
         * Refresh the selected question item when navigated to next markscheme
         */
        this.onQuestionItemChanged = function () {
            _this.setState({ toggle: !_this.state.toggle });
        };
        /*
         * Returns true is marking overlay is visible.
         */
        this.doAllowKeyPress = function () {
            if ((markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                !markerOperationModeFactory.operationMode.isDefinitveMarkingStarted) ||
                markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
                return true;
            }
            else {
                return (stampStore.instance.isFavouriteToolbarEmpty
                    && !eCourseworkHelper.isDigitalFile()
                    && !_this.props.selectedQuestionItem.isUnZonedItem
                    && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner
                    && worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
                    && !markerOperationModeFactory.operationMode.isTeamManagementMode
                    && responseStore.instance.markingMethod !== enums.MarkingMethod.MarkFromObject);
            }
        };
        /**
         * Set focus on mark entry text box.
         */
        this.setFocusOnMarkEntryTextbox = function () {
            if (!_this._isTabletOrMobileDevice) {
                _this.refs.markEntryTextBox.focus();
            }
        };
        this.state = {
            toggle: false
        };
        this.marksSchemeHelper = new markSchemeHelper();
        var helper;
        if (this.props.isNonNumeric === true) {
            helper = new nonNumericMarkingHelper();
        }
        else {
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
    Object.defineProperty(SelectedQuestionItem.prototype, "isResetButtonEnabled", {
        /**
         * Returns true if reset button is enabled
         * @returns
         */
        get: function () {
            return this.markingHelper.isResetEnabled(this.currentItem.allocatedMarks.displayMark);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectedQuestionItem.prototype, "canDoLoggingInGoogleAnalytics", {
        /**
         * returns whether google analytics enabled and needs to log in analytics based on
         * isDirty or isMarkByKeyboard
         * @returns
         */
        get: function () {
            // checking analytics enabled or not
            // isDirty will be true only if marked by keyboard
            // isMarkByKeyboard setting true initially, will be false once mark button used
            return ((this.isDirty || !this.isMarkByKeyboard));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectedQuestionItem.prototype, "isNextMarkSchemeAvailable", {
        /**
         * Return whether next or previous mark scheme is available for marking.
         * @returns next or prvious markable item is ready.
         */
        get: function () {
            return (!this.props.isDownArrowDisabled);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Render method of the component
     */
    SelectedQuestionItem.prototype.render = function () {
        var upArrowClass = 'question-nav prev-question-btn light';
        var downArrowClass = 'question-nav next-question-btn light';
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
        var resetMarkButton = (this.props.isResponseEditable) ?
            (React.createElement("div", {className: 'active-question-button-holder'}, this.getNRButtonVisibility(), React.createElement("div", {className: 'reset-btn-holder'}, React.createElement("button", {className: 'rounded reset-btn lite', onClick: this.onResetButtonClicked.bind(this), title: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.reset-mark-button-tooltip'), disabled: (!this.isResetButtonEnabled)}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.reset-mark-button'))))) : null;
        return (React.createElement("div", {className: 'active-question'}, React.createElement("a", {href: 'javascript:void(0)', className: upArrowClass, title: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-question-button-tooltip'), onClick: this.onUpArrowClick}, React.createElement("span", {className: 'top-arrow-blue sprite-icon'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-question-button-tooltip'))), React.createElement("a", {href: 'javascript:void(0)', className: downArrowClass, title: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.next-question-button-tooltip'), onClick: this.onDownArrowClick}, React.createElement("span", {className: 'bottom-arrow-blue sprite-icon'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-question-button-tooltip'))), React.createElement("div", {className: 'active-question-wrapper'}, React.createElement("div", {className: 'active-question-holder'}, React.createElement("span", {className: 'active-question-text'}, this.currentItem.name), this.getMarkEntryPanel()), resetMarkButton)));
    };
    /**
     * When markByAnnotation CC is enabled  and the response is editable, then it will skip the markEntryTextBox.
     */
    SelectedQuestionItem.prototype.getMarkEntryPanel = function () {
        var _displayMark;
        if (this.mark.displayMark === constants.NOT_ATTEMPTED) {
            _displayMark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
        }
        else {
            _displayMark = this.mark.displayMark;
        }
        if (this.props.isResponseEditable &&
            (!responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus))) {
            return (React.createElement("span", {className: 'active-mark'}, this.renderLinkIndicator(this.props.selectedQuestionItem.bIndex), React.createElement("input", {id: 'markingPanel', ref: 'markEntryTextBox', type: 'text', className: 'active-question-mark', value: _displayMark, onChange: this.onChange, onInput: this.onTextChange, onBlur: this.activateDeactivateListener, onFocus: this.selectMarkText, onPaste: this.preventPaste, spellCheck: false, autoComplete: 'off', onKeyDown: this.onKeyDownHandle, "aria-label": 'markingPanel'}), React.createElement("span", {className: 'active-mark-slash'}, (this.props.isNonNumeric === true) ? '' : '/'), React.createElement("span", {className: 'active-question-total-mark'}, (this.props.isNonNumeric === true) ? '' :
                this.currentItem.maximumNumericMark)));
        }
        else if (this.props.isResponseEditable &&
            (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus))) {
            return (React.createElement("span", {className: 'active-mark'}, this.renderLinkIndicator(this.props.selectedQuestionItem.bIndex), React.createElement("label", {className: 'active-question-mark'}, _displayMark), React.createElement("span", {className: 'active-mark-slash'}, (this.props.isNonNumeric === true) ? '' : '/'), React.createElement("span", {className: 'active-question-total-mark'}, (this.props.isNonNumeric === true) ? '' :
                this.currentItem.maximumNumericMark)));
        }
        else {
            return (React.createElement("span", {className: 'active-mark'}, this.renderLinkIndicator(this.props.selectedQuestionItem.bIndex), React.createElement("label", {className: 'active-question-mark'}, _displayMark), React.createElement("span", {className: 'active-mark-slash'}, (this.props.isNonNumeric === true) ? '' : '/'), React.createElement("span", {className: 'active-question-total-mark'}, (this.props.isNonNumeric === true) ? '' :
                this.currentItem.maximumNumericMark)));
        }
    };
    /**
     * Checking the NRButton Visibility based on MarkbyAnnoation CC.
     */
    SelectedQuestionItem.prototype.getNRButtonVisibility = function () {
        if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
            return (React.createElement(NRButton, {onNRButtonClick: this.onNRButtonClick, isDisabled: this.doHideNRbutton()}));
        }
    };
    /**
     * When a new mark has tried to invoke
     * @param {any} e
     */
    SelectedQuestionItem.prototype.onKeyDownHandle = function (e) {
        // If markscheme panel is busy by scrolling or confirmation is popup is displayed
        // block any further keyboard mark entry
        if (this.scrollHelper.isMarkSchemeScrolling) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    /**
     * Preventing pasting texts to mark entry
     * @param {any} e
     */
    SelectedQuestionItem.prototype.preventPaste = function (e) {
        e.preventDefault();
    };
    /**
     * Upadte NR mark on button click
     */
    SelectedQuestionItem.prototype.onNRClick = function () {
        var mark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
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
    };
    /**
     * Resetting current item to ensure on every page navigation ms should be updated.
     */
    SelectedQuestionItem.prototype.resetCurrentItem = function () {
        // This will reset only when the response load for the first time.
        if (this.currentItem === undefined) {
            this.currentItem = this.props.selectedQuestionItem;
            this.mark = this.currentItem.allocatedMarks;
        }
    };
    /**
     * This included to remove React warning message.
     * we are considering HTML5 onInput rather this.
     * @param event
     */
    SelectedQuestionItem.prototype.onChange = function (event) {
        var isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
        // closing exiting comment box (if it is open).
        if (isCommentBoxOpen) {
            stampActionCreator.showOrHideComment(false);
            return;
        }
    };
    /**
     * Triggers when the marking text panel loses the focus
     * then activate the global marking handler to continue marking.
     */
    SelectedQuestionItem.prototype.activateDeactivateListener = function (event) {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, true);
        this.hasFocus = false;
    };
    /**
     * If input text has current focus we dont need global handler
     * textbox itself will hanle it
     */
    SelectedQuestionItem.prototype.selectMarkText = function () {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, false);
        this.hasFocus = true;
    };
    /**
     * down arrow click event
     */
    SelectedQuestionItem.prototype.onDownArrowClick = function () {
        if (!this.props.isDownArrowDisabled) {
            this.props.onMoveNext();
        }
    };
    /**
     * up arrow click event
     */
    SelectedQuestionItem.prototype.onUpArrowClick = function () {
        this.props.onMovePrev();
    };
    /**
     * Attaching key down event on component mount
     */
    SelectedQuestionItem.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_UPDATED_EVENT, this.markUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS, this.enterNRForUnMarkedItems);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_SCHEME_SCROLL_ACTION, this.markSchemeScrollReset);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_MARK_ENTRY_SELECTION, this.removeMarkEntrySelection);
        markingStore.instance.addListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT, this.onEnhancedOffPageCommentUpdateCompleted);
        useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT, this.setSingleDigitMarkIsWithoutEnter);
        stampStore.instance.addListener(stampStore.StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT, this.setFocusOnMarkEntryTextbox);
        /** Hooking the key press event only if response open in marking mode */
        // Mount the handler
        var handler = new moduleKeyHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, enums.Priority.Third, true, this.handleKeyPress, enums.KeyMode.press);
        var scrollHandler = new moduleKeyHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL, enums.Priority.Third, true, this.handleKeyDown, enums.KeyMode.down);
        // Hooking the events
        keyDownHelper.instance.mountKeyDownHandler(scrollHandler);
        keyDownHelper.instance.mountKeyPressHandler(handler);
    };
    /**
     * Removing key down event handlers on component unmount
     */
    SelectedQuestionItem.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_UPDATED_EVENT, this.markUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS, this.enterNRForUnMarkedItems);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_SCHEME_SCROLL_ACTION, this.markSchemeScrollReset);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT, this.onEnhancedOffPageCommentUpdateCompleted);
        keyDownHelper.instance.unmountKeyHandler(modulekeys.MARKSCHEME_TEXT_ENTRY);
        keyDownHelper.instance.unmountKeyHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_MARK_ENTRY_SELECTION, this.removeMarkEntrySelection);
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT, this.setSingleDigitMarkIsWithoutEnter);
        stampStore.instance.removeListener(stampStore.StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT, this.setFocusOnMarkEntryTextbox);
    };
    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    SelectedQuestionItem.prototype.componentWillReceiveProps = function (nextProps) {
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
    };
    /**
     * Component did update
     */
    SelectedQuestionItem.prototype.componentDidUpdate = function () {
        if (this.isDirty === false && this.refs.markEntryTextBox) {
            this.setMarkEntryBoxSelected(false);
        }
    };
    /**
     * Handles the markscheme panel navigation.
     * @param {KeyboardEvent} event
     */
    SelectedQuestionItem.prototype.handleKeyDown = function (event) {
        if (this.doAllowKeyPress()) {
            return true;
        }
        var handled = false;
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
                this.props.onValidateMarkEntry(this.currentItem.minimumNumericMark, this.currentItem.maximumNumericMark, this.props.isNonNumeric);
                var oldMark = this.currentItem.allocatedMarks.displayMark;
                this.props.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED, loggerConstants.MARKENTRY_TYPE_INVALIDMARK, oldMark, this.mark);
                if (this.isNextMarkSchemeAvailable === false && this.confirmationForLastMarkScheme) {
                    /* updating the mark panel with the previous mark only after the mark confirmation
                       and required only for the last mark */
                    this.updateMark(this.previousMark.displayMark);
                }
                else {
                    // updating the mark panel with the original mark
                    this.updateMark(this.originalMark.displayMark);
                }
                return true;
            }
        }
        // Handle down and up arrow and enter key to navigate
        if (event.keyCode === enums.KeyCode.enter) {
            this.isNavigating = true;
            this.setSelectedQuestionItemIndex();
        }
        var target = event.target;
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
                    var result = this.markingHelper.processSpecialKeys(event.keyCode || event.charCode, this.refs.markEntryTextBox.value);
                    // If the user has selected backspace, we dont need to update the mark
                    if (result[1] === true && result[0] !== this.refs.markEntryTextBox.value) {
                        // If the use has been removed text we dont need to trigger the validate
                        this.updateMark(result[0]);
                    }
                    handled = result[1];
                }
            }
        }
        else {
            handled = true;
        }
        // This will prevent response navigation throgh keyboard.
        if (handled === true) {
            /* not preventing default for left and right key down events */
            if (event.keyCode === enums.KeyCode.left || event.keyCode === enums.KeyCode.right) {
                keyDownHelper.KeydownHelper.stopEvent(event, false);
            }
            else if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)
                && (event.keyCode === enums.KeyCode.enter)) {
                keyDownHelper.KeydownHelper.stopEvent(event, false);
            }
            else {
                keyDownHelper.KeydownHelper.stopEvent(event, true);
            }
        }
        return handled;
    };
    /**
     * This is to invoke the textbox input event to start the validation.
     */
    SelectedQuestionItem.prototype.triggerMarkValueUpdatedEvent = function () {
        // React recommented way to notify the textchange.
        ReactTestUtils.Simulate.input(this.refs.markEntryTextBox);
    };
    /**
     * Update the mark in mark text panel and set the focus to continue marking.
     * @param {string} mark
     * @param {boolean} triggerUpdate
     * @param {boolean} doFocus
     */
    SelectedQuestionItem.prototype.updateMark = function (mark, triggerUpdate, doFocus) {
        if (triggerUpdate === void 0) { triggerUpdate = true; }
        if (doFocus === void 0) { doFocus = true; }
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
    };
    /**
     * Handle key press event.
     * @param event
     */
    SelectedQuestionItem.prototype.handleKeyPress = function (event) {
        // If the response not in marking mode or marking check mode key press won't work.
        // If favorite toolbar is empty and showing first toolbar banner.
        // block any further keyboard mark entry
        var target = event.target;
        if (target && target.id === 'submitSingleResponse_submitSingleResponse' && event.keyCode === 13) {
            return;
        }
        if (!markingStore.instance.isMarkingInProgress
            || worklistStore.instance.isMarkingCheckMode
            || this.doAllowKeyPress()) {
            return true;
        }
        // To filter the functional keypress.
        if (!this.markingHelper.isFunctionalKeys(event.keyCode)) {
            keyDownHelper.KeydownHelper.stopEvent(event);
            // We are listening to global handler only if we lost focus. Once we have focus,
            // we can continue with text box's own keypress.
            keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, false);
            var resultText = this.markingHelper.getTextValue(event.keyCode || event.charCode, '');
            this.updateMark(resultText);
            return true;
        }
    };
    /**
     * Reset marks and annotation associated to the current markscheme
     * @param {Event} event
     */
    SelectedQuestionItem.prototype.onResetButtonClicked = function (event) {
        this.props.onResetConfirm(true);
    };
    /**
     * Resetting the scroll value to false to allow mark entry
     */
    SelectedQuestionItem.prototype.markSchemeScrollReset = function () {
        if (this.isNextMarkSchemeAvailable === false) {
            this.scrollHelper.resetScroll(false);
            this.confirmationForLastMarkScheme = true;
        }
    };
    /**
     * set the index of the selected question item
     */
    SelectedQuestionItem.prototype.setSelectedQuestionItemIndex = function () {
        if (!markSchemeHelper.isNextResponseAvailable && !this.props.isLastNode) {
            var nextNode = this.marksSchemeHelper.getMarkableItemByDirection(this.props.treeNodes, this.props.selectedQuestionItem.nextIndex, enums.MarkSchemeNavigationDirection.Forward);
            if (nextNode) {
                markingActionCreator.setSelectedQuestionItemIndex(nextNode.bIndex, nextNode.uniqueId);
            }
        }
    };
    /**
     * return jsx element to render link indicator
     * @param bIndex
     */
    SelectedQuestionItem.prototype.renderLinkIndicator = function (bIndex) {
        var doRenderLinkIndicator = markSchemeHelper.doRenderLinkIndicator(markSchemeHelper.getLinkableMarkschemeId(this.props.selectedQuestionItem, this.props.treeNodes));
        if (doRenderLinkIndicator) {
            var toolTip = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.link-indicator-tooltip');
            var linkIndicatorId = 'selected_question_link_icon_' + bIndex.toString();
            return markSchemeHelper.renderLinkIndicator(linkIndicatorId, toolTip);
        }
    };
    return SelectedQuestionItem;
}(pureRenderComponent));
module.exports = SelectedQuestionItem;
//# sourceMappingURL=selectedquestionitem.js.map