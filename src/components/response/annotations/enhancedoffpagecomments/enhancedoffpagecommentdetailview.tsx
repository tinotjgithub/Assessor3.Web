import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import enums = require('../../../utility/enums');
let classNames = require('classnames');
import localeStore = require('../../../../stores/locale/localestore');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import Dropdown = require('../../../utility/dropdown');
import markingStore = require('../../../../stores/marking/markingstore');
import sortHelper = require('../../../../utility/sorting/sorthelper');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import enhancedOffPageCommentHelper = require('../../../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
import configurableCharacteristicsValues = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import eCourseWorkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import responseStore = require('../../../../stores/response/responsestore');
import worklistStore = require('../../../../stores/worklist/workliststore');
import constants = require('../../../utility/constants');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
import exceptionStore = require('../../../../stores/exception/exceptionstore');
import messageStore = require('../../../../stores/message/messagestore');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');
import ccHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import qigStore = require('../../../../stores/qigselector/qigstore');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');

interface Props extends LocaleSelectionBase, PropsBase {
    onButtonClick: Function;
    responseMode: enums.ResponseMode;
    commentText: string;
    enhancedOffPageCommentClientToken: string;
    textAreaChanged: Function;
    selectedCommentQuestionId: number;
    selectedFileId: number;
    onQuestionItemOrFileChanged: Function;
    isAddButtonClicked: boolean;
    selectedCommentIndex: number;
    isTeamManagementMode: boolean;
    heightInPercentage: Function;
    containerElement: HTMLElement;
}

interface State {
    renderedOn?: number;
}

interface Item {
    id: number;
    sequenceNo: number;
    name: string;
}

/**
 * enhanced OffPageComments Detail View
 * @param props 
 */
// tslint:disable-next-line:variable-name
class EnhancedOffPageCommentsDetailView extends pureRenderComponent<Props, State> {

    /** refs */
    public refs: {
        [key: string]: (Element);
        enhancedOffPageCommentsDetailView: (HTMLInputElement);
        enhancedOffPageCommentsButtonContainer: (HTMLInputElement);
    };

    private dropDownStyle: React.CSSProperties;
    private isItemDropDownOpen: boolean;
    private isFileDropDownOpen: boolean;
    private questionItemsList: Array<Item> = new Array<Item>();
    private selectedQuestionItem: string;
    private ecourseworkFileItemsList: Array<Item> = new Array<Item>();
    private selectedFile: string;
    private selectedDropDown: enums.DropDownType;
    private isSelectedItemClicked: boolean;
    private _boundHandleOnClick: EventListenerObject = null;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.getDropDownItemsList();
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);
        this.onDropDownClicked = this.onDropDownClicked.bind(this);
        // Set the default states
        this.state = {
            renderedOn: 0
        };
    }

    /**
     * Render method
     */
    public render() {

        let renderButtonHolder: JSX.Element = (<div className='comment-button-holder'
            ref={'enhancedOffPageCommentsButtonContainer'}>
            {this.renderDeleteButton()}
            {this.renderCancelOrCloseButton()}
            {this.renderSaveButton()}
        </div>);
        let renderCommentEditor: JSX.Element = (<div className='comment-detail-content'>
            <div className='offpage-comment-editor-holder'>
                {this.isReadOnly ?
                    <div id='enhancedOffpageCommentEditor' className='offpage-comment-editor'>
                        {this.props.commentText}
                    </div>
                    :
                    <textarea
                        id='enhancedOffpageCommentEditor'
                        className='offpage-comment-editor'
                        placeholder={localeStore.instance.TranslateText
                            ('marking.response.enhanced-off-page-comments-panel.comment-text-placeholder')}
                        value={this.props.commentText}
                        onFocus={this.onTextAreaFocus}
                        onBlur={this.onTextAreaBlur}
                        onChange={this.onTextChanged}
                        maxLength={constants.ENHANCED_OFFPAGE_COMMENT_MAXIMUM_LENGTH}>
                    </textarea>}
            </div>
        </div>);

        let renderItemDropDown: JSX.Element =
            this.isReadOnly ?
                (<div className='comment-item-dropdown' id='enhancedOffPageComment_questionItem'>
                    <span title={localeStore.instance.TranslateText
                        ('marking.response.enhanced-off-page-comments-panel.question-item-dropdown-tooltip')
                        + this.selectedQuestionItem} className='dropdown-text'>
                        <span>{this.selectedQuestionItem}</span>
                    </span>
                </div>) : (<Dropdown dropDownType={enums.DropDownType.EnhancedOffPageCommentQuestionItem}
                    id={'select_enhancedOffPageComment_questionItem'}
                    style={this.dropDownStyle}
                    className={'dropdown-wrap comment-item-dropdown'}
                    selectedItem={this.selectedQuestionItem}
                    isOpen={this.isItemDropDownOpen}
                    items={this.questionItemsList}
                    onClick={this.onDropDownClicked}
                    onSelect={this.onQuestionItemSelected}
                    title={localeStore.instance.TranslateText
                        ('marking.response.enhanced-off-page-comments-panel.question-item-dropdown-tooltip')
                        + this.selectedQuestionItem} />
                );

        let renderFileDropDown: JSX.Element = configurableCharacteristicsValues.isECourseworkComponent ?
            (this.isReadOnly ?
                (<div className='comment-file-dropdown' id='enhancedOffPageComment_file'>
                    <span title={localeStore.instance.TranslateText
                        ('marking.response.enhanced-off-page-comments-panel.question-item-dropdown-tooltip')
                        + this.selectedFile} className='dropdown-text'>
                        <span>{this.selectedFile}</span>
                    </span>
                </div>) : (<Dropdown dropDownType={enums.DropDownType.EnhancedOffPageCommentFile}
                    id={'select_enhancedOffPageComment_file'}
                    style={this.dropDownStyle}
                    className={'dropdown-wrap comment-file-dropdown'}
                    selectedItem={this.selectedFile}
                    isOpen={this.isFileDropDownOpen}
                    items={this.ecourseworkFileItemsList}
                    onClick={this.onDropDownClicked}
                    onSelect={this.onQuestionItemSelected}
                    title=
                    {localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.file-dropdown-tooltip')
                        + this.selectedFile} />)) : null;
        return (
            <div className='comment-detail-wrapper' ref={'enhancedOffPageCommentsDetailView'}>
                <div className='comment-detail-header clearfix'>
                    <div className='comment-menu-holder'>
                        {renderItemDropDown}
                        {renderFileDropDown}
                    </div>
                    {renderButtonHolder}
                </div>
                {renderCommentEditor}
            </div>
        );
    }

    /**
     * componentDidMount
     * @memberof EnhancedOffPageCommentsContainer
     */
    public componentDidMount() {
        window.addEventListener('click', this._boundHandleOnClick);

        // Set the focus on enhanced off page text area when detail view is enabled
        if (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
            htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
        }
        if (this.props.containerElement) {
            this.props.containerElement.addEventListener('transitionend', this.onTransitionEnd);
            this.props.containerElement.addEventListener('webkitTransitionEnd', this.onTransitionEnd);
        }
    }


    /**
     * ComponentWillUnMount
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._boundHandleOnClick);
        if (this.props.containerElement) {
            this.props.containerElement.removeEventListener('transitionend', this.onTransitionEnd);
            this.props.containerElement.removeEventListener('webkitTransitionEnd', this.onTransitionEnd);
        }
    }

    /**
     * Gets cancel or close button texts.
     * @returns {string} 
     */
    private getCancelOrCloseButtonText = (): string => {
        return this.isReadOnly ?
            localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.close-button') :
            localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.cancel-button');
    }

    /**
     * render Delete button
     * @returns 
     */
    private renderDeleteButton = (): JSX.Element => {
        return (!this.isReadOnly
            && !this.props.isAddButtonClicked) ?
            (<button id='deleteCommentRow' className='rounded'
                onClick={() => {
                    this.props.onButtonClick(enums.EnhancedOffPageCommentAction.Delete,
                        this.props.enhancedOffPageCommentClientToken);
                }}>
                {localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.delete-button')}
            </button>) : null;
    }

    /**
     * render save button
     * @returns 
     */
    private renderSaveButton = (): JSX.Element => {
        return !this.isReadOnly ?
            (<button id='saveCommentRow'
                className={classNames('rounded primary', { 'disabled': !this.isSaveButtonEnabled() })}
                disabled={!this.isSaveButtonEnabled()}
                onClick={() => {
                    this.props.onButtonClick(enums.EnhancedOffPageCommentAction.Save,
                        this.props.enhancedOffPageCommentClientToken);
                }}>
                {localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.save-button')}
            </button>) : null;
    }

    /**
     * Render cancel or close buttons.
     * @returns 
     */
    private renderCancelOrCloseButton = (): JSX.Element => {
        let buttonText: string = this.getCancelOrCloseButtonText();
        return (<button id={buttonText + 'CommmentDetailView'}
            onClick={() => { this.props.onButtonClick(enums.EnhancedOffPageCommentAction.Close); }}
            className={classNames('rounded', { 'primary': this.isReadOnly })}>
            {buttonText}
        </button>);
    }

    /**
     * On Text area is focused
     */
    private onTextAreaFocus = (event: any) => {
        // Moving the cursor point to last(due to IE and ipad issue).
        // Setting the selection range to the last postion so that the cursor will be focused there
        if (htmlUtilities.isIE || htmlUtilities.isIE11 || htmlUtilities.isIPadDevice) {
            let length: number = event.target.value.length;
            event.target.setSelectionRange(length, length);
        }
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EnhancedOffPageComments);
    }

    /**
     * On text area blur
     */
    private onTextAreaBlur() {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.EnhancedOffPageComments);
    }

    /**
     * On Text changed
     * @param event
     */
    private onTextChanged = (event: any) => {
        // If any of the dropdown is open while changing the text we have to close the dropdown
        this.isFileDropDownOpen = undefined;
        this.isItemDropDownOpen = undefined;
        this.props.textAreaChanged(event.target.value);
    }

    /**
     * On Dropdown clicked
     */
    private onDropDownClicked = (dropDown: enums.DropDownType, width: number): void => {
        this.isSelectedItemClicked = true;
        if (width) {
            this.dropDownStyle = { minWidth : width };
        }
        this.selectedDropDown = dropDown;
        if (dropDown === enums.DropDownType.EnhancedOffPageCommentQuestionItem) {
            this.isFileDropDownOpen = undefined;
            this.isItemDropDownOpen = this.isItemDropDownOpen === undefined ? true : !this.isItemDropDownOpen;
        } else if (dropDown === enums.DropDownType.EnhancedOffPageCommentFile) {
            this.isItemDropDownOpen = undefined;
            this.isFileDropDownOpen = this.isFileDropDownOpen === undefined ? true : !this.isFileDropDownOpen;
        }
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * On Question Item Selected
     */
    private onQuestionItemSelected = (selectedId: number): void => {
        this.props.onQuestionItemOrFileChanged(selectedId, this.selectedDropDown);
        if (this.selectedDropDown === enums.DropDownType.EnhancedOffPageCommentQuestionItem) {
            this.selectedQuestionItem = this.questionItemsList.filter((item: Item) =>
                item.id === selectedId)[0].name;
        } else if (this.selectedDropDown === enums.DropDownType.EnhancedOffPageCommentFile) {
            this.selectedFile = this.ecourseworkFileItemsList.filter((item: Item) =>
                item.id === selectedId)[0].name;
        }
        enhancedOffPageCommentHelper.handleCommentEdit(true);
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Get the question items list
     */
    private getDropDownItemsList = (): void => {
        if (this.questionItemsList.length === 0) {
            let item: Item = {
                id: 0,
                sequenceNo: 0,
                name: constants.DEFAULT_QUESTION_OR_FILE_ITEM
            };

            this.questionItemsList.push(item);

            let markSchemes: Immutable.Map<number, MarkSchemeInfo> = markingStore.instance.getMarkSchemes;
            if (markSchemes) {
                markSchemes.forEach((value: MarkSchemeInfo) => {
                    if (value.markGroupId === markingStore.instance.selectedQIGMarkGroupId) {
                        let item: Item = {
                            id: markSchemes.keyOf(value),
                            sequenceNo: value.sequenceNo,
                            name: value.markSchemeText
                        };

                        this.questionItemsList.push(item);
                    }
                });

                sortHelper.sort(this.questionItemsList, comparerList.MarkSchemeComparer);
                this.selectedQuestionItem = this.questionItemsList.filter((item: Item) =>
                    item.id === this.props.selectedCommentQuestionId)[0].name;
            }

            if (configurableCharacteristicsValues.isECourseworkComponent && this.ecourseworkFileItemsList.length === 0) {
                let item: Item = {
                    id: 0,
                    sequenceNo: 0,
                    name: constants.DEFAULT_QUESTION_OR_FILE_ITEM
                };
                this.ecourseworkFileItemsList.push(item);
                let isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
                let responseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(
                    responseStore.instance.selectedDisplayId.toString());
                let ecourseworkFiles: Immutable.List<eCourseWorkFile> =
                    eCourseWorkFileStore.instance.getCourseWorkFilesAgainstIdentifier
                        (isStandardisationSetupMode ? responseDetails.esMarkGroupId : responseDetails.markGroupId);
                if (ecourseworkFiles) {
                    ecourseworkFiles.forEach((file: eCourseWorkFile) => {
                        let item: Item = {
                            id: file.docPageID,
                            sequenceNo: file.docPageID,
                            name: file.title
                        };
                        this.ecourseworkFileItemsList.push(item);
                    });

                    this.selectedFile = this.ecourseworkFileItemsList.filter((item: Item) =>
                        item.id === this.props.selectedFileId)[0].name;
                }
            }
        }
    }

    /**
     * Handle click events on the window and collapse dropdowns
     * @param {any} source - The source element
     */
    private handleOnClick = (e: any): any => {
        if (!this.isSelectedItemClicked && ((this.isItemDropDownOpen !== undefined && this.isItemDropDownOpen)
            || (this.isFileDropDownOpen !== undefined && this.isFileDropDownOpen))) {
            // collapse the dropdown
            this.isFileDropDownOpen = undefined;
            this.isItemDropDownOpen = undefined;
            this.setState({ renderedOn: Date.now() });
        } else {
            this.isSelectedItemClicked = false;
        }

        //Fix for defect 54305: Blocked the window event which is fired while clicking message editor
        // When the buttons are clicked we dont need to set focus on the text area
        if (e.target !== window && this.refs.enhancedOffPageCommentsDetailView.contains(e.target) &&
            !this.refs.enhancedOffPageCommentsButtonContainer.contains(e.target)) {
            // If the click is inside the enhanced off page container. set focus to the editor
            htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
        }

    };

    /**
     * Save button has to be disabled when there is no comment entered
     */
    private isSaveButtonEnabled = (): boolean => {
        if (this.props.commentText === '' && this.props.isAddButtonClicked) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Returns true comment is read only else return false.
     * @private
     * @memberof EnhancedOffPageCommentsDetailView
     */
    private get isReadOnly(): boolean {

        let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        let updatePendingResponsesWhenSuspendedCCOn: boolean = ccHelper.getCharacteristicValue
            (ccNames.UpdatePendingResponsesWhenSuspended, markSchemeGroupId).toLowerCase() === 'true';
        let isReadOnlyModeInClassifiedResponse: boolean =
            (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse
            && (!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives ||
                qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete));

        return this.props.responseMode === enums.ResponseMode.closed || this.props.selectedCommentIndex !== 0 ||
            this.props.isTeamManagementMode || ((standardisationSetupStore.instance.isUnClassifiedWorklist ||
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                enums.StandardisationSetup.ProvisionalResponse) &&
                    !markerOperationModeFactory.operationMode.isResponseEditable) ||
            worklistStore.instance.isMarkingCheckMode ||
            (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended &&
                this.props.responseMode === enums.ResponseMode.pending &&
                !updatePendingResponsesWhenSuspendedCCOn) || isReadOnlyModeInClassifiedResponse;
    }

    /**
     * onTransitionEnd
     * 
     * @private
     * @memberof EnhancedOffPageCommentsDetailView
     */
    private onTransitionEnd = (event: any) => {
        if (event.target && event.target.id === 'enhanced-off-page-comments-container'
            && !(exceptionStore.instance.isExceptionPanelVisible || messageStore.instance.isMessagePanelVisible)) {
            let containerHeight: number = this.props.containerElement.getBoundingClientRect().height;
            if (containerHeight <= constants.ENHANCED_OFFPAGE_COMMENT_DETAIL_VIEW_MIN_HEIGHT) {
                let marksheetInner = htmlUtilities.getBoundingClientRect('markSheetContainerInner', true).height;
                let heightInPercentage: number = annotationHelper.pixelsToPercentConversion(containerHeight, marksheetInner);
                userOptionsHelper.save(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT, heightInPercentage.toString(), true);
                this.props.heightInPercentage(heightInPercentage);
            }
        }
    }
}

export = EnhancedOffPageCommentsDetailView;