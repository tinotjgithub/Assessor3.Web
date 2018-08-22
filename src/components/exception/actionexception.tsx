import React = require('react');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import GenericButton = require('../utility/genericbutton');
import enums = require('../utility/enums');
import pureRenderComponent = require('../base/purerendercomponent');
import exceptionStore = require('../../stores/exception/exceptionstore');
import qigStore = require('../../stores/qigselector/qigstore');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import exceptionactionCreator = require('../../actions/exception/exceptionactioncreator');
import operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
import warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import keyDownHelper = require('../../utility/generic/keydownhelper');

interface Props extends LocaleSelectionBase, PropsBase {
    exceptionDetails: ExceptionDetails;
}

interface State {
    renderedOn?: number;
    isActionExceptionButtonDisabled?: boolean;
    exceptionComment?: string;
}

/**
 * ActionException contain an area for adding exception comments, ok and cancel buttons.
 * @param props
 * @param state
 */
class ActionException extends pureRenderComponent<Props, State> {
    private isShowPopup: boolean;
    private exceptionActionType: enums.ExceptionActionType;
    private isActionExceptionButtonClicked: boolean = false;
    /**
     * Constructor ActionException
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0,
            isActionExceptionButtonDisabled: true,
            exceptionComment: ''
        };

        this.isShowPopup = false;
        this.exceptionActionType = enums.ExceptionActionType.Escalate;
        this.showActionExceptionPopup = this.showActionExceptionPopup.bind(this);
        this.commentChanged = this.commentChanged.bind(this);
        this.onActionInterruption = this.onActionInterruption.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        return (
            <div className={classNames('popup medium popup-overlay close-button escalate-exception-popup ',
                { 'open': this.isShowPopup }) }
                id='EscalateException' role='dialog' aria-labelledby='popup7Title' aria-describedby='popup7Desc'>
                <div className='popup-wrap'>
                    <div className='popup-header'>
                        <h4 id='popup7Title'>{localeStore.instance.
                            TranslateText('generic.response.' +
                            enums.ExceptionActionType[this.exceptionActionType].toLowerCase() + '-exception-dialog.header')}</h4>
                    </div>
                    <div className='popup-content' id='popup7Desc'>
                        <p>{localeStore.instance.
                            TranslateText('generic.response.' +
                            enums.ExceptionActionType[this.exceptionActionType].toLowerCase() + '-exception-dialog.body') }</p>
                        <textarea className='escalate-comment'
                            id='exception_action_comment'
                            aria-label='exception_action_comment'
                            onChange={this.commentChanged }
                            value={this.state.exceptionComment}>
                        </textarea>
                    </div>
                    <div className='popup-footer text-right'>
                        <GenericButton
                            id={ 'cancel-exception-action-button' }
                            key={'key_cancel-exception-action-button' }
                            className={'button  close-button rounded'}
                            title={localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button') }
                            content={localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button') }
                            onClick={this.cancelExceptionAction}
                            disabled={false}
                            selectedLanguage = {this.props.selectedLanguage}/>
                        <GenericButton
                            id={ 'exception-action-button' }
                            key={'key_exception-action-button' }
                            className={'button rounded primary'}
                            onClick={this.updateExceptionStatus}
                            title={localeStore.instance.
                                TranslateText('generic.response.view-exception-panel.' +
                                enums.ExceptionActionType[this.exceptionActionType]) }
                            content={localeStore.instance.
                                TranslateText('generic.response.view-exception-panel.' +
                                enums.ExceptionActionType[this.exceptionActionType]) }
                            disabled={this.state.isActionExceptionButtonDisabled}
                            selectedLanguage = {this.props.selectedLanguage}/>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        this.addEventListeners();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        this.removeEventListeners();
    }

    /**
     * Add all event listeners for action exception here
     */
    private addEventListeners() {
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP,
            this.showActionExceptionPopup);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED,
            this.onUpdateExceptionStatusReceived);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
            this.handleExceptionActionFailure);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT,
            this.onActionInterruption);
    }

    /**
     * Remove all event listeners for action exception here.
     */
    private removeEventListeners() {

        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP,
            this.showActionExceptionPopup);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED,
            this.onUpdateExceptionStatusReceived);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
            this.handleExceptionActionFailure);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT,
            this.onActionInterruption);
    }

    /**
     * Handles the action event for showing action exception popup.
     */
    private showActionExceptionPopup = (doVisiblePopup: boolean, exceptionActionType: enums.ExceptionActionType) => {
        this.isShowPopup = doVisiblePopup;
        // deactivating the keydown helper while action exception panel(Resolve or escalate poup) is open
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
        this.exceptionActionType = exceptionActionType;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Cancel the exception action.
     */
    private cancelExceptionAction = () => {
        this.isActionExceptionButtonClicked = false;
        this.isShowPopup = false;
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
        this.setState({
            exceptionComment: '',
            isActionExceptionButtonDisabled: true,
            renderedOn: Date.now()
        });
    };

    /**
     *  This will call on update exception status received
     */
    private onUpdateExceptionStatusReceived = (doNaviageteToTeamManagement: boolean = false) => {
        if (!doNaviageteToTeamManagement) {
            this.isActionExceptionButtonClicked = false;
            this.isShowPopup = false;
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            this.setState({
                exceptionComment: '',
                isActionExceptionButtonDisabled: true,
                renderedOn: Date.now()
            });
        }
    }

    /**
     * Render the exception comment box.
     * @param- event
     */
    private commentChanged = (event: any) => {
        let exceptionComment = event.target.value;

        this.setState({
            isActionExceptionButtonDisabled: this.isValidException(exceptionComment),
            exceptionComment: exceptionComment
        });
    };

    /**
     * This method will validate whether or not the exception comment section edited
     * @param- exceptionComment
     */
    public isValidException = (exceptionComment: string) => {
        return !(exceptionComment.trim().length > 0);
    };

    /**
     * update exception status escalate or resolved.
     */
    private updateExceptionStatus = () => {
        // To avoid double click a variable is set check whether the button is already clicked or not
        if (this.props.exceptionDetails && !this.isActionExceptionButtonClicked) {
            this.isActionExceptionButtonClicked = true;
            let exceptionDetails = this.props.exceptionDetails;

            let comments: Array<ExceptionComments> = [{
                comment: this.state.exceptionComment,
                uniqueId: 0,
                examinerID: this.props.exceptionDetails.ownerExaminerId,
                escalationPoint: this.props.exceptionDetails.ownerEscalationPoint,
                authorIsGroup: false,
                exceptionId: this.props.exceptionDetails.uniqueId,
                updatedBy: ''
            }];

            let exceptionParams: RaiseExceptionParams = {
                uniqueId: this.props.exceptionDetails.uniqueId,
                exceptionType: this.props.exceptionDetails.exceptionType,
                currentStatus: this.props.exceptionDetails.currentStatus,
                exceptionComments: comments,
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
            let exceptionActionParams: ExceptionActionParams = {
                exception: exceptionParams,
                actionType: this.exceptionActionType,
                requestedByExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
                qigId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId

            };
            exceptionactionCreator.updateExceptionStatus(exceptionActionParams, teamManagementStore.instance.isRedirectFromException);
        }
    };

    /**
     * Method to handle the exception action failure.
     */
    private handleExceptionActionFailure = (failureCode: enums.FailureCode,
        warningMessageAction: enums.WarningMessageAction): void => {
        if (failureCode !== enums.FailureCode.None
            && warningMessageAction === enums.WarningMessageAction.ExceptionAction) {
            this.isShowPopup = false;
            this.setState({
                exceptionComment: '',
                isActionExceptionButtonDisabled: true,
                renderedOn: Date.now()
            });
        }
    }

    /**
     * On user action interruption
     */
    private onActionInterruption(): void {
        // When the application is offline and the escalate or resolve exception popu is present
        if (!applicationStore.instance.isOnline) {
            this.isShowPopup = false;
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            this.setState({
                exceptionComment: '',
                isActionExceptionButtonDisabled: true,
                renderedOn: Date.now()
            });
        }
    }
}

export = ActionException;