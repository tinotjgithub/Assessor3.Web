import React = require('react');
import ExceptionBase = require('./exceptionbase');
import exceptionStore = require('../../stores/exception/exceptionstore');
import DropDownException = require('./dropdownexception');
import qigStore = require('../../stores/qigselector/qigstore');
import markingStore = require('../../stores/marking/markingstore');
import exceptionactionCreator = require('../../actions/exception/exceptionactioncreator');
import ExceptionTypeInfo = require('./exceptiontypeinfo');
import ExceptionCommentHistory = require('./exceptioncommenthistory');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import enums = require('../utility/enums');
import popupHelper = require('../utility/popup/popuphelper');
import scriptHelper = require('../../utility/script/scripthelper');
import localeStore = require('../../stores/locale/localestore');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import exceptionHelper = require('../utility/exception/exceptionhelper');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import responseStore = require('../../stores/response/responsestore');
import constants = require('../utility/constants');
import responseHelper = require('../utility/responsehelper/responsehelper');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import currentQuestionItemInfo = require('../../actions/marking/currentquestioniteminfo');
import deviceHelper = require('../../utility/touch/devicehelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import navigationHelper = require('../utility/navigation/navigationhelper');
import worklistStore = require('../../stores/worklist/workliststore');
import eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
import eCourseworkFile = require('../../stores/response/digital/typings/courseworkfile');

interface Props extends PropsBase, LocaleSelectionBase {
    isOpen?: boolean;
    responseId?: number;
    questionId?: number;
    closeExceptionPanel: Function;
    isNewException: boolean;
    exceptionDetails: ExceptionDetails;
    exceptionData: Immutable.List<ExceptionDetails>;
    isExceptionPanelVisible: boolean;
    hasUnManagedSLAO: boolean;
    currentQuestionItemInfo: currentQuestionItemInfo;
    isFromMediaErrorDialog: boolean;
    exceptionBody: string;
    hasUnmanagedImageZone: boolean;
}

interface State {
    renderedOn?: number;
    showExceptionTypeclassName?: string;
    selectedExceptionTypeId?: number;
    selectedExceptionDescriptionId?: number;
    selectedRelatesTo?: number;
    isSubmitButtonDisabled?: boolean;
    exceptionComment?: string;
    isExceptionTypeMenuSelected?: boolean;
}


class Exception extends ExceptionBase {


    private _scriptHelper: scriptHelper;

    // indicates whether the exeptiontype information is visible
    private exceptionTypeInfoClose: boolean = false;
    // indicates whether the exeption action is available
    private isExceptionActionAvailable: boolean = false;
    //Exception type id of exception file access error
    private selectedExceptionTypeId: number = 25;
    //MarkSchemeGroupName of Qig in Whole Response
    private _markSchemeGroupName: string = null;
    //MarkSchemeGroupid of Qig in Whole Response
    private _markSchemeGroupId: number = undefined;
    //MarkGroupid of Qig in Whole Response
    private _markGroupId: number = undefined;
    //ExaminerRoleId of Examiner in Qig in Whole Response
    private _examinerRoleId: number = undefined;

    /**
     * Constructor Exception
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0,
            showExceptionTypeclassName: 'close',
            isSubmitButtonDisabled: true,
            exceptionComment: '',
            isExceptionTypeMenuSelected: false
        };

        this.commentChanged = this.commentChanged.bind(this);
        this.saveException = this.saveException.bind(this);
        this.showExceptionType = this.showExceptionType.bind(this);
        this.selectExceptionType = this.selectExceptionType.bind(this);
        this.showExceptionDescription = this.showExceptionDescription.bind(this);
        this.closeExceptionPanel = this.closeExceptionPanel.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.resetScroll = this.resetScroll.bind(this);
        this.onActionException = this.onActionException.bind(this);
        this.resetExceptionPanel = this.resetExceptionPanel.bind(this);
    }

    /**
     * Component did  mount
     */
    public componentDidMount() {
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionPanelClose);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.resetExceptionPanel);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.raiseException);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.closeExceptionPanel);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION, this.resetScroll);
    }

    /**
     * Componet will unmount
     */
    public componentWillUnmount() {
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionPanelClose);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent);
        if (exceptionStore.instance.exceptionViewAction !== enums.ExceptionViewAction.None) {
            exceptionactionCreator.exceptionWindowAction(enums.ExceptionViewAction.None);
        }
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.resetExceptionPanel);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.raiseException);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.closeExceptionPanel);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION, this.resetScroll);
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {
        //when exception is raised from error dialog, then the Entire Response radio button should be selected by default
        //so setting selectedRelatesTo to 0
        if (this.props.isFromMediaErrorDialog && this.state.selectedRelatesTo === undefined) {
            this.setState({
                selectedRelatesTo: 0
            });
        }
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let panelContent: JSX.Element;
        if (this.props.exceptionData && this.props.exceptionData !== null
            && !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            panelContent = this.exceptionPanelContent();
        }
        return (
            <div id='responseExceptionContainer' className='response-message response-exception-container'>
                {this.renderExceptionHeader()}
                <div className='messaging-content'>
                    {panelContent}
                </div>
            </div>
        );
    }

    /**
     * Get the exception details
     */
    private getExceptionData = () => {
        //TODO -- Use the method in store to get selectedAudioVideo files
        let selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter((x: eCourseworkFile) =>
            (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio)).first() : undefined;
        let filename = selectedFile.title;
        let currentlySelectedExceptionType: ExceptionTypeDetails = this.getExceptionTypeDetails(this.selectedExceptionTypeId.toString());
        this.setState({
            selectedExceptionTypeId: this.selectedExceptionTypeId,
            exceptionComment: filename + '\n\n' + this.props.exceptionBody.replace(/<br\/>/g, ''),
            isSubmitButtonDisabled: (currentlySelectedExceptionType) ? false : true
        });
    }

    /**
     * Render Exception Header.
     */
    private renderExceptionHeader(): JSX.Element {
        let headerDetails;
        if (this.props.isNewException || !this.props.isExceptionPanelVisible) {
            headerDetails = (
                <h3 id='popup2TitleException' className='shift-left comp-msg-title'>
                    {localeStore.instance.TranslateText('marking.response.exception-list-panel.raise-new-exception')}
                </h3>);
        } else {
            headerDetails = (<h3 id='popup2TitleException' className='shift-left comp-msg-title'>
                <span className='exceptionid-label'>
                    {localeStore.instance.TranslateText('marking.response.view-exception-panel.header')}
                </span>
                <span className='exceptionid-colon'>: </span>
                <span className='exception-id'>{constants.EXCEPTION_ID_PREFIX + this.props.exceptionDetails.uniqueId}</span></h3>);
        }
        return (
            <div className='response-msg-header clearfix'>
                {headerDetails}
                {this.props.isNewException || !this.props.isExceptionPanelVisible ?
                    (<div id='exception_submit_btn' className='shift-left comp-msg-butons'>
                        <button id='submit_exception' className='button primary rounded'
                            title={localeStore.instance.TranslateText('marking.response.raise-exception-panel.submit-button')}
                            onClick={this.saveException} disabled={this.state.isSubmitButtonDisabled}>
                            {localeStore.instance.TranslateText('marking.response.raise-exception-panel.submit-button')}
                        </button>
                    </div>) : null}
                {teamManagementStore.instance.isRedirectFromException && this.props.isExceptionPanelVisible ?
                    (<button id='back_to_exception_btn' className='rounded back-exception-btn light'
                        title={localeStore.instance.TranslateText('generic.response.exception-panel.back-to-exceptions')}
                        onClick={this.navigatetoExceptionList}>
                        {localeStore.instance.TranslateText('generic.response.exception-panel.back-to-exceptions')}
                    </button>) : null}
                <div className='shift-right minimize-message'>
                    <a className='minimize-message-link'
                        title={localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip')}
                        onClick={this.onMinimize}>
                        <span className='minimize-icon lite'>Minimize</span>
                    </a>
                    <a className='maximize-message-link'
                        title={localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip')}
                        onClick={this.onMaximize}>
                        <span className='maxmize-icon lite'></span>
                    </a>
                    {
                        !teamManagementStore.instance.isRedirectFromException ?
                            <a className='close-message-link'
                                title={localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip')}
                                onClick={this.closeExceptionPanel}>
                                <span className='close-icon lite'>Close</span>
                            </a> : null
                    }

                </div>
            </div>
        );
    }

    private closeExceptionPanel = () => {
        // Inorder to exclude the 'open' or 'class' from the exception type div.
        if (this.state.selectedExceptionTypeId === undefined && this.state.exceptionComment === '') {
            this.setState({
                isExceptionTypeMenuSelected: false
            });
        }
        this.props.closeExceptionPanel();
    };

    /**
     * Render Exception Content.
     */
    private exceptionPanelContent(): JSX.Element {
        let exceptionRelateWrap = (this.props.hasUnManagedSLAO || this.props.hasUnmanagedImageZone)
            ? null :
            (<div id='exceptionRelateWrap' className='exception-relate-wrap'>
                <div className='dim-text exception-relate-label'>
                    {localeStore.instance.TranslateText('marking.response.raise-exception-panel.exception-relates-to-label')} </div>
                {this.renderExceptionRelatesTo()}
            </div>);
        if (this.props.isNewException || !this.props.isExceptionPanelVisible) {
            let newExceptionSubTitle = (this.props.hasUnManagedSLAO || this.props.hasUnmanagedImageZone)
                ? localeStore.instance.TranslateText('marking.response.raise-exception-panel.new-exception-subtitle-has-unmanagedslao')
                : localeStore.instance.TranslateText('marking.response.raise-exception-panel.exception-type-label');
            return (<div className='exception-wrapper'>
                {exceptionRelateWrap}
                <div className='exception-type-menu-wrap clearfix'>
                    <div className='exception-reason-label dim-text'>
                        {newExceptionSubTitle}
                    </div>
                    {this.renderExceptionTypes()}
                </div>
                {this.renderExceptionMessage()}
            </div>);
        } else {

            this.isExceptionActionAvailable = markerOperationModeFactory.operationMode.isTeamManagementMode &&
                this.props.exceptionDetails.currentStatus === enums.ExceptionStatus.Open &&
                examinerStore.instance.getMarkerInformation.examinerId === this.props.exceptionDetails.ownerExaminerId;

            return (<div className='exception-wrapper'>
                <div className='exception-detail-wrapper'>

                    <ExceptionTypeInfo
                        id={'exception-info'}
                        key={'exception-info'}
                        selectedLanguage={this.props.selectedLanguage}
                        exceptionTypeId={this.props.exceptionDetails.exceptionType}
                        status={this.props.exceptionDetails.currentStatus}
                        markSchemeId={this.props.exceptionDetails.markSchemeID}
                        onActionException={this.onActionException}
                        isExceptionActionAvailable={this.isExceptionActionAvailable}
                        alternativeEscalationPoint={this.props.exceptionDetails.alternativeEscalationPoint}
                        isPE={qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer}
                        questionName={this.props.exceptionDetails.markSchemeID === 0 ?
                            (responseStore.instance.isWholeResponse ?
                                qigStore.instance.getMarkSchemeGroupName(this.props.exceptionDetails.markSchemeGroupID)
                                : 'Entire response') : markingStore.instance.toolTip(this.props.exceptionDetails.markSchemeID)} />

                    {this.renderExceptionCommentHistory()}
                </div>
            </div>);
        }
    }

    /**
     * Render Exception Types.
     */
    private renderExceptionTypes(): JSX.Element {
        let dropdownclassName = 'dropdown-wrap exception-type option-menu-wrap shift-left ' +
            (this.state.isExceptionTypeMenuSelected ? this.state.showExceptionTypeclassName : '');
        let exceptionTypeDescription: string = '';
        let isDisabled: boolean = false;
        let exceptionTypes = exceptionHelper.sortExceptionTypes(exceptionStore.instance.getExceptionTypes);
        let blockerDescription: string;
        if (this.props.hasUnManagedSLAO) {
            // for SLAO unmanaged scenario, expection type related to the Selected QIG should be displayed.
            this._markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        } else if (this.props.currentQuestionItemInfo &&
            this.props.currentQuestionItemInfo.markSchemeGroupId &&
            this._markSchemeGroupId === undefined) {
            this._markSchemeGroupId = this.props.currentQuestionItemInfo.markSchemeGroupId;
        }
        let toRender = exceptionTypes.map((exceptionType: ExceptionTypeDetails, index: number) => {
            if (exceptionType.markSchemeGroupId === this._markSchemeGroupId) {
                exceptionTypeDescription = '';
                isDisabled = false;
                // Disable already raised exception.
                if (this.props.exceptionData) {
                    this.props.exceptionData.map((data: ExceptionDetails, index: number) => {
                        if (this.state.selectedRelatesTo === 0) {
                            if (data.markSchemeID === 0 && exceptionType.exceptionType === data.exceptionType
                                && data.currentStatus !== enums.ExceptionStatus.Closed &&
                                data.markSchemeGroupID === exceptionType.markSchemeGroupId) {
                                exceptionTypeDescription = localeStore.instance.TranslateText
                                    ('marking.response.raise-exception-panel.open-exception-exists-against-response');
                                isDisabled = true;
                            }
                        } else {
                            if (data.markSchemeID === 0 && exceptionType.exceptionType === data.exceptionType
                                && data.currentStatus !== enums.ExceptionStatus.Closed && (
                                    data.markSchemeGroupID === exceptionType.markSchemeGroupId
                                    || this.props.hasUnManagedSLAO || this.props.hasUnmanagedImageZone)) {
                                exceptionTypeDescription = localeStore.instance.TranslateText
                                    ('marking.response.raise-exception-panel.open-exception-exists-against-response');
                                isDisabled = true;
                            } else if (data.markSchemeID === this._questionId
                                && exceptionType.exceptionType === data.exceptionType
                                && data.currentStatus !== enums.ExceptionStatus.Closed) {
                                exceptionTypeDescription = localeStore.instance.TranslateText
                                    ('marking.response.raise-exception-panel.open-exception-exists-against-question');
                                isDisabled = true;
                            }
                        }
                    });
                }

                blockerDescription = exceptionHelper.getExceptionDescription(exceptionType,
                    exceptionStore.instance.isExceptionBlocker(exceptionType.exceptionType));

                return <DropDownException
                    id={exceptionType.exceptionType}
                    key={exceptionType.exceptionType.toString()}
                    isOpen={parseInt(this.state.selectedExceptionDescriptionId) === exceptionType.exceptionType}
                    isChecked={parseInt(this.state.selectedExceptionTypeId) === exceptionType.exceptionType}
                    onClick={this.selectExceptionType}
                    showExceptionDesc={this.showExceptionDescription}
                    isDisabled={isDisabled}
                    description={exceptionTypeDescription}
                    blockerDescription={blockerDescription}
                />;
            }
        });
        let dropdownText = '';
        let selectedExceptionType: ExceptionTypeDetails = this.getExceptionTypeDetails(this.state.selectedExceptionTypeId);
        if (selectedExceptionType === null) {
            dropdownText = localeStore.instance.TranslateText('marking.response.raise-exception-panel.select-exception-type-placeholder');
        } else {
            dropdownText = localeStore.instance.TranslateText('generic.exception-types.' +
                selectedExceptionType.exceptionType + '.name');
        }

        // reset the scroll position only after clicking the exceptiontype info icon
        if (this.exceptionTypeInfoClose) {
            exceptionactionCreator.setScrollForExceptionType();
            this.exceptionTypeInfoClose = false;
        }
        return (
            <div className={dropdownclassName} onClick={this.showExceptionType}>
                <a id='exceptionSelected' className='menu-button exception-type-caption'>
                    <span>
                        {dropdownText}
                    </span>
                    <span className='sprite-icon menu-arrow-icon'></span>
                </a>
                <div id='exceptionMenu' className='menu' role='menu'
                    title={localeStore.instance.TranslateText('marking.response.raise-exception-panel.exception-type-tooltip')}
                    aria-hidden='true' >
                    <div className='exception-type-menu-content panel-group'>
                        {toRender}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Reset the scroll position for exception type list
     */
    private resetScroll = () => {
        let exceptionTypeInfo = document.getElementsByClassName('exception-type-menu-item menu-item panel open')[0];
        if (exceptionTypeInfo) {
            $('#exceptionMenu').animate({ scrollTop: exceptionTypeInfo.offsetTop }, 1000);
        }
    };

    /**
     * Render the exception Relates to items.
     */
    private renderExceptionRelatesTo(): JSX.Element {
        if (this.props.currentQuestionItemInfo &&
            this.props.currentQuestionItemInfo.uniqueId) {
            if (this._questionId === undefined) {
                this._questionId = this.props.currentQuestionItemInfo.uniqueId;
            }
            this._questionName = localeStore.instance.TranslateText('marking.response.raise-exception-panel.selected-question')
                + markingStore.instance.toolTip(this._questionId);
        }
        let selectedQuestionItem;
        selectedQuestionItem = this.state.selectedRelatesTo === undefined ?
            this._questionId : this.state.selectedRelatesTo;
        return (
            <div className='exception-relate-option-wrap '>
                <div className='exception-relate-option'>
                    <input type='radio' value='selected' id='exceptionRelated1' name='exceptionRelated'
                        defaultChecked={this.state.selectedRelatesTo !== 0} onChange={null} />
                    <label htmlFor='exceptionRelated1' onClick={selectedQuestionItem !== this._questionId ?
                        this.changeRelatesTo.bind(this, this._questionId) : null}>
                        <span className='radio-ui'></span>
                        <span className='label-text'>{this._questionName}</span>
                    </label>
                </div>
                <div className='exception-relate-option'>
                    <input type='radio' value='selected' id='exceptionRelated2' name='exceptionRelated'
                        defaultChecked={this.state.selectedRelatesTo === 0} />
                    <label htmlFor='exceptionRelated2' onClick={selectedQuestionItem !== 0 ?
                        this.changeRelatesTo.bind(this, 0) : null}>
                        <span className='radio-ui'></span>
                        <span className='label-text'>
                            {responseStore.instance.isWholeResponse ? this._markSchemeGroupName
                                : localeStore.instance.TranslateText('marking.response.raise-exception-panel.entire-response')}
                        </span>
                    </label>
                </div>
            </div>
        );
    }

    /**
     * Render the exception comment box.
     */
    private renderExceptionMessage(): JSX.Element {
        return (
            <div className='exception-message-wrap'>
                <textarea ref={'commentTextBox'} aria-label='Exception' name='exception-msg' id='exceptionmsg' className='exception-message'
                    placeholder={localeStore.instance.TranslateText('marking.response.raise-exception-panel.comment-placeholder')}
                    onChange={this.commentChanged} value={this.state.exceptionComment}
                    onFocus={this.onFocus}>
                </textarea>
            </div>
        );
    }

    /**
     * This method will call on focus of exception comment box text area
     * @param e
     */
    private onFocus(e: any): void {
        this.setState({
            showExceptionTypeclassName: 'close'
        });
    }

    /**
     * Render the exception History.
     */
    private renderExceptionCommentHistory(): JSX.Element {
        let commentDetails = this.props.exceptionDetails.exceptionComments;
        let exceptionStatus = this.props.exceptionDetails.currentStatus;
        let isEscalated: boolean = false;
        let toRender = commentDetails.map((comment: ExceptionComments, index: number) => {
            if ((exceptionStatus === enums.ExceptionStatus.Open && index === 0) ||
                (exceptionStatus === (enums.ExceptionStatus.Resolved || enums.ExceptionStatus.Closed) && index === 0) ||
                (exceptionStatus === (enums.ExceptionStatus.Resolved || enums.ExceptionStatus.Closed) &&
                    index === commentDetails.length - 1)) {
                isEscalated = false;
            } else {
                isEscalated = true;
            }

            return <ExceptionCommentHistory
                key={'comment-history' + index}
                commentedBy={comment.examinerName}
                isEscalated={isEscalated}
                updatedDate={comment.updatedDate}
                comments={comment.comment}
                exceptionStatus={comment.exceptionStatus}
                id={index} />;
        });

        return (<div className='exception-history-wrapper'>
            {toRender}
        </div>);
    }

    /**
     * Render the exception comment box.
     * @param- event
     */
    private commentChanged = (event: any) => {
        let exceptionComment = event.target.value;

        this.setState({
            isSubmitButtonDisabled: this.isValidException(true, exceptionComment, this.state.selectedExceptionTypeId),
            exceptionComment: exceptionComment
        });

        this.props.validateException(this.isValidException(false, exceptionComment, this.state.selectedExceptionTypeId));
    };

    /**
     * Navigate to the team Management ExceptionList
     */
    private navigatetoExceptionList() {
        teamManagementActionCreator.getTeamManagementOverviewCounts(
            teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId);
        teamManagementActionCreator.getUnactionedExceptions(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, true);
        navigationHelper.loadTeamManagement();
    }

    /**
     * Save the Exception to Db.
     */
    private saveException() {
        this._scriptHelper = new scriptHelper();
        let selectedExceptionType: ExceptionTypeDetails = this.getExceptionTypeDetails(this.state.selectedExceptionTypeId);
        let isEbookMarking: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false;

        let comments: Array<ExceptionComments> = [{
            comment: this.state.exceptionComment,
            uniqueId: 0,
            examinerID: examinerStore.instance.getMarkerInformation.examinerId,
            escalationPoint: enums.EscalationPoint.None,
            authorIsGroup: false,
            updatedBy: ''
        }];

        let raiseExceptionParams: RaiseExceptionParams = {
            candidateScriptID: this._scriptHelper.getResponseData.candidateScriptId,
            exceptionType: this.state.selectedExceptionTypeId,
            markSchemeGroupID: this._markSchemeGroupId,
            markGroupId: this._markGroupId,
            isEBookMarking: isEbookMarking,
            originatorExaminerId: examinerStore.instance.getMarkerInformation.examinerId,
            questionPaperPartID: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            ownerEscalationPoint: selectedExceptionType.ownerEscalationPoint,
            exceptionComments: comments,
            currentStatus: enums.ExceptionStatus.Open,
            exceptionId: 0,
            markSchemeID: this.state.selectedRelatesTo === undefined ?
                this._questionId : this.state.selectedRelatesTo,
            originatorExaminerRoleId: this._examinerRoleId,
            ownerExaminerId: selectedExceptionType.ownerExaminerId,
            uniqueId: 0,
            displayId: responseStore.instance.selectedDisplayId,
            examinerName: examinerStore.instance.getMarkerInformation.formattedExaminerName
        };
        this.setState({
            isSubmitButtonDisabled: true,
            exceptionComment: ''
        }, function () {
            // Call the raise exception Action.
            exceptionactionCreator.raiseExceptionAction(raiseExceptionParams,
                worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString()).markGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        });
    }

    /**
     * Get the Exception type details.
     */
    private getExceptionTypeDetails(exceptionTypeId: string): ExceptionTypeDetails {
        let exceptionTypes: Immutable.List<ExceptionTypeDetails> = exceptionStore.instance.getExceptionTypes;
        let selectedExceptionType: ExceptionTypeDetails = null;

        if (exceptionTypes) {
            exceptionTypes.map((exceptionType: ExceptionTypeDetails) => {
                if (exceptionType.exceptionType === parseInt(exceptionTypeId)) {
                    selectedExceptionType = exceptionType;
                }
            });
        }
        return selectedExceptionType;
    }

    /**
     * Show ExceptionType Dropdown.
     */
    private showExceptionType() {
        this.setState({
            isExceptionTypeMenuSelected: true,
            showExceptionTypeclassName: this.state.showExceptionTypeclassName === 'close' ? 'open' : 'close'
        });
    }

    /**
     * Select the ExceptionType.
     * @param- exceptionTypeid
     * @param- isDisabled
     * @param- event
     */
    private selectExceptionType(exceptionTypeId: number, isDisabled: boolean, event: any) {
        let exceptionComment = this.state.exceptionComment;

        if (!isDisabled) {
            this.setState({
                selectedExceptionTypeId: exceptionTypeId,
                isSubmitButtonDisabled: this.isValidException(true, exceptionComment, exceptionTypeId),
                showExceptionTypeclassName: 'close'
            });
        }

        this.props.validateException(this.isValidException(false, exceptionComment, exceptionTypeId));
        event.stopPropagation();
    }

    /**
     * This method will validate whether or not the Exception Panel is edited
     * @param- isSubmitButton
     * @param- exceptionComment
     * @param- exceptionTypeid
     */
    public isValidException = (isSubmitButton: boolean, exceptionComment: any, exceptionTypeId: number) => {
        if (isSubmitButton) {
            return !(exceptionComment.trim().length > 0 && exceptionTypeId !== undefined);
        } else {
            return !(exceptionComment.trim().length > 0 || exceptionTypeId !== undefined);
        }
    };

    /**
     * Show the Exception Description.
     * @param- exceptionTypeid
     * @param- isOpen
     * @param- event
     */
    private showExceptionDescription(exceptionTypeId: number, isOpen: string, event: any) {
        this.exceptionTypeInfoClose = isOpen !== 'open';
        this.setState({
            selectedExceptionDescriptionId: isOpen === 'open' ? 0 : exceptionTypeId
        });
        event.stopPropagation();
    }

    /**
     * Select changeRelatesto Items.
     * @param- uniqueId
     */
    private changeRelatesTo = (uniqueId: number) => {
        let exceptionComment = this.state.exceptionComment;
        this.setState({
            selectedRelatesTo: uniqueId,
            selectedExceptionTypeId: undefined,
            isSubmitButtonDisabled: this.isValidException(true, exceptionComment, undefined),
        });
    };

    /**
     * Save exception Callback.
     * @param- res
     */
    private raiseException = (response: RaiseExceptionResponse) => {
        this.props.closeExceptionPanel(response.success, response.createExceptionReturnErrorCode);
    };

    /**
     * Method fired to close the exception panel.
     */
    private onExceptionPanelClose = () => {
        this.resetExceptionPanel();
    };

    /**
     * Method fired to reset the exception panel.
     */
    private resetExceptionPanel = () => {
        this._questionId = undefined;
        this._markSchemeGroupId = undefined;
        if (exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.Open) {
            this._markSchemeGroupId = (this.props.hasUnManagedSLAO
                || this.props.hasUnmanagedImageZone) ? qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                : markingStore.instance.selectedQIGMarkSchemeGroupId;
            this._markSchemeGroupName = responseStore.instance.isWholeResponse ? qigStore.instance.
                getMarkSchemeGroupName(this._markSchemeGroupId) : null;
            this._markGroupId = markingStore.instance.getMarkGroupIdQIGtoRIGMap(this._markSchemeGroupId);
            if (this.props.hasUnManagedSLAO || this.props.hasUnmanagedImageZone) {
                this._examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            } else {
                this._examinerRoleId = markingStore.instance.selectedQIGExaminerRoleId;
            }
        }
        this.setState({
            selectedExceptionTypeId: undefined,
            showExceptionTypeclassName: 'close',
            isSubmitButtonDisabled: true,
            selectedRelatesTo: undefined,
            exceptionComment: '',
            renderedOn: Date.now(),
            selectedExceptionDescriptionId: 0,
            isExceptionTypeMenuSelected: false
        });
        if (this.props.isFromMediaErrorDialog) {
            this.getExceptionData();
        }
        if (this.props.isNewException && this.refs.commentTextBox !== undefined && !deviceHelper.isTouchDevice()) {
            this.refs.commentTextBox.focus();
        }
    };

    /**
     * This method is handling the letious popup events.
     */
    private onPopUpDisplayEvent = (popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType) => {
        switch (popUpType) {
            case enums.PopUpType.DiscardException:
            case enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick:
            case enums.PopUpType.DiscardOnNewExceptionButtonClick:
                if (popUpActionType === enums.PopUpActionType.Yes) {
                    this.resetExceptionPanel();
                }
                break;
            case enums.PopUpType.CloseException:
                if (popUpActionType === enums.PopUpActionType.Yes) {
                    this.closeException();
                }
                break;
        }
    };

    /**
     * Update exception status to Db
     */
    private closeException() {
        let exceptionParams: RaiseExceptionParams = {
            uniqueId: this.props.exceptionDetails.uniqueId,
            exceptionType: this.props.exceptionDetails.exceptionType,
            currentStatus: enums.ExceptionStatus.Closed,
            exceptionComments: null,
            markSchemeID: this.props.exceptionDetails.markSchemeID,
            ownerEscalationPoint: this.props.exceptionDetails.ownerEscalationPoint,
            ownerExaminerId: this.props.exceptionDetails.ownerExaminerId,
            markGroupId: this.props.exceptionDetails.markGroupId,
            candidateScriptID: this.props.exceptionDetails.candidateScriptID,
            markSchemeGroupID: this.props.exceptionDetails.markSchemeGroupID,
            questionPaperPartID: this.props.exceptionDetails.questionPaperPartID,
            originatorExaminerId: this.props.exceptionDetails.originatorExaminerId,
            isEBookMarking: this.props.exceptionDetails.iseBookMarking
        };
        /* Defect 46286 - Exception count is not getting updated once after closing the exception.
           To fix the issue by clearing the worklist cache after closing the exception.So it required worklist type, response mode,
           remark request type as the exception argument */
        let exceptionActionParams: ExceptionActionParams = {
            exception: exceptionParams,
            actionType: enums.ExceptionActionType.Close,
            requestedByExaminerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            worklistType: worklistStore.instance.currentWorklistType,
            responseMode: worklistStore.instance.getResponseMode,
            remarkRequestType: worklistStore.instance.getRemarkRequestType,
            displayId: responseStore.instance.selectedDisplayId.toString(),

        };
        exceptionactionCreator.updateExceptionStatus(exceptionActionParams);
    }

    /**
     * handle exception actions such as Escalate, Resolve, Close
     */
    private onActionException = (exceptionActionType: enums.ExceptionActionType) => {
        if (exceptionActionType === enums.ExceptionActionType.Close) {
            popUpDisplayActionCreator.popUpDisplay(
                enums.PopUpType.CloseException,
                enums.PopUpActionType.Show,
                enums.SaveAndNavigate.none,
                {
                    popupContent:
                    localeStore.instance.TranslateText('marking.response.close-exception-dialog.body')
                });
        } else {
            exceptionactionCreator.doVisibleExceptionActionPopup(true, exceptionActionType);
        }
    }
}

export = Exception;
