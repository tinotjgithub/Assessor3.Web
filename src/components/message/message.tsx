import React = require('react');
import GenericButton = require('../utility/genericbutton');
import MessagePriorityDropDown = require('./messageprioritydropdown');
import MessageEditor = require('./messageeditor');
import Subject = require('./subject');
import messageStore = require('../../stores/message/messagestore');
import localeStore = require('../../stores/locale/localestore');
import MessageBase = require('./messagebase');
import enums = require('../utility/enums');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import qigStore = require('../../stores/qigselector/qigstore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import MessageDetails = require('./messagerightpanel');
let classNames = require('classnames');
import popupHelper = require('../utility/popup/popuphelper');
import worklistStore = require('../../stores/worklist/workliststore');
import constants = require('../utility/constants');
import qiqStore = require('../../stores/qigselector/qigstore');
import stringHelper = require('../../utility/generic/stringhelper');
import ConfirmationDialog = require('../utility/confirmationdialog');
import markingHelper = require('../../utility/markscheme/markinghelper');
import messageArgument = require('../../dataservices/messaging/messageargument');
import messageHelper = require('../utility/message/messagehelper');
import operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import teamArgument = require('../../dataservices/messaging/teamargument');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import configurablecharacteristicshelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurablecharacteristicsnames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import markingStore = require('../../stores/marking/markingstore');

interface Props extends PropsBase, LocaleSelectionBase {
    messageType: enums.MessageType;
    closeMessagePanel: Function;
    responseId: number;
    supervisorId: number;
    supervisorName: string;
    selectedMessage?: Message;
    selectedMsgDetails?: MessageDetails;
    onMessageMenuActionClickCallback: Function;
    onMessageClose: Function;
}

interface State {
    renderedOn?: number;
    isDeleteMessagePopupVisible?: boolean;
}

interface Item {
    id: number;
    name: string;
    parentExaminerDisplayName: string;
    parentExaminerId: number;
    questionPaperPartId: number;
    isMessagePanelVisible: boolean;
}

class Message extends MessageBase {

    private responseData: ResponseBase;
    // message type
    private currentMessageType: enums.MessageType = enums.MessageType.InboxCompose;
    // this variable will hold the message panel visiblity status.
    private isMessagePopupVisible = false;
    private qigListItems: Array<Item>;
    private selectedQigItemDisplayed: string;
    private supervisorId: number;
    private supervisorName: string;
    private selectedMsg: Message;
    private selectedMsgDetails: MessageDetails = null;
    private selectedQuestionPaperPartId: number;
    private priorityDropdownSelectedItem: enums.MessagePriority = enums.MessagePriority.Standard;
    private responseId: string;
    private removeMandatoryMessagePriority: boolean = true;
    private _mandatoryMessagesFromMarkingToolCC: boolean = false;
    private currentExaminerName: string;
    private currentExaminerId: number;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0
        };

        this.teamListReceived = this.teamListReceived.bind(this);
        this._mandatoryMessagesFromMarkingToolCC = configurablecharacteristicshelper.getCharacteristicValue(
            configurablecharacteristicsnames.MandatoryMessagesFromMarkingTool).toLowerCase() === 'true' ? true : false;
        this.doShowMandatoryMessagePriority = this.doShowMandatoryMessagePriority.bind(this);

    }

    /**
     * Render method
     */
    public render(): JSX.Element {

        if (this.props.messageType === enums.MessageType.ResponseDetails) {

            return (
                <div className='response-message response-message-container'>
                    {this.renderMessageHeader()}

                    <MessageDetails
                        id='resp-msg-det' key='resp-msg-det'
                        selectedLanguage={this.props.selectedLanguage}
                        message={this.props.selectedMessage}
                        //The forward button should be hidden when the examiner has no supervisor
                        isForwardButtonHidden={examinerStore.instance.parentExaminerId === 0}
                        messageDetails={this.props.selectedMsgDetails}
                        selectedTab={enums.MessageFolderType.None}
                        onMessageMenuActionClickCallback={this.props.onMessageMenuActionClickCallback}/>

                </div>
            );
        }

        let _showMandatoryMessagePriority: boolean = this.doShowMandatoryMessagePriority();
        this.currentExaminerName = this.currentExaminerName === undefined ?
            this.props.supervisorName : this.currentExaminerName;
        if (this.props.messageType === enums.MessageType.ResponseCompose && this.messageBody === '') {
            this.messageBody = messageHelper.getMessageContent(enums.MessageType.ResponseCompose);
        }

        let workListType = worklistStore.instance.currentWorklistType;
        let markingMode = worklistStore.instance.getMarkingModeByWorkListType(workListType);
        let isElectronicStandardisationTeamMember = 0;
        if (markingMode === enums.MarkingMode.ES_TeamApproval &&
            qiqStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember) {
            isElectronicStandardisationTeamMember = 1;
        }

        return (<div className='compose-new-msg response-message-container' id='message-container'>
            {this.renderMessageHeader()}
            <div className='messaging-content'>
                <div className='comp-msg-top'>
                    <div className='clearfix'>
                        <div className='comp-resp-id shift-left'>
                            <span className='dim-text' id='associated-response-id-text'>
                                {localeStore.instance.TranslateText('messaging.compose-message.associated-response') + ': '}
                            </span>
                            <span className='message-resonse-id' id='associated-response-id'>
                                {messageHelper.getMarkingModeText(markingMode, isElectronicStandardisationTeamMember) +
                                    this.props.responseId}
                            </span>
                        </div>
                        <div className='set-priority shift-right'>
                            <MessagePriorityDropDown id={'select_priority'}
                                dropDownType={enums.DropDownType.Priority}
                                className={'dropdown-wrap align-right'}
                                selectedItem={this.getPriorityDropDownItem(this.priorityDropDownSelectedItem)}
                                isOpen={this.clickedDropDown === enums.DropDownType.Priority ? this.isDropDownOpen : undefined}
                                items={[{
                                    id: enums.MessagePriority.Standard,
                                    name: this.getPriorityDropDownItem(enums.MessagePriority.Standard)
                                },
                                {
                                    id: enums.MessagePriority.Important,
                                    name: this.getPriorityDropDownItem(enums.MessagePriority.Important)
                                },
                                _showMandatoryMessagePriority ? {
                                    id: enums.MessagePriority.Mandatory,
                                    name: this.getPriorityDropDownItem(enums.MessagePriority.Mandatory)
                                } : null]}
                                onClick={this.onDropDownClick}
                                onSelect={this.onSelect} />
                        </div>
                    </div>
                    <div className='msg-recipient-wrap'>
                        <div className='rec-address-label' id='message-to-label'>
                            {localeStore.instance.TranslateText('messaging.compose-message.to-button') + ': '}
                        </div>
                        <div className='recipiants-list-wrap'>
                            <span className='recipiant-name' id='message-recipiant-name'>
                                {this.currentExaminerName}
                            </span>
                        </div>
                    </div>
                    <div className='comp-subject-wrap'>
                        <label htmlFor='message-subject' id={'subject-label'} className='comp-subject-label'>
                            {localeStore.instance.TranslateText('messaging.compose-message.subject') + ': '}
                        </label>
                        <Subject id={'message-subject'} key={'key-message-subject'} outerClass={'subject-input-wrap'}
                            refName={'subjectInput'} hasFocus={this.props.messageType === enums.MessageType.ResponseCompose}
                            className={'subject-input'} onChange={this.handleSubjectChange} maxLength={120}
                            isVisible={this.props.isMessagePanelVisible}
                            value={this.messageSubject} callback={this.props.onMessageClose} />
                    </div>
                </div>
                <div className='comp-msg-bottom' ref='msgEditor'>
                    <div className='msg-editor'>
                        <MessageEditor htmlContent={this.messageBody}
                            hasFocus={messageHelper.hasFocus(this.props.messageType)}
                            id={this.msgEditorId}
                            key={'key-' + this.msgEditorId}
                            toggleSaveButtonState={this.toggleSaveButtonState}
                            selectedLanguage={this.props.selectedLanguage} />
                    </div>
                </div>
            </div>
        </div>);

    }


    /**
     * Method to render message header.
     */
    private renderMessageHeader() {
        return (
            <div className={classNames(
                'clearfix',
                { 'response-msg-header': this.props.messageType === enums.MessageType.ResponseDetails },
                { 'compose-msg-header': this.props.messageType !== enums.MessageType.ResponseDetails })}>
                <h3 id='popup2Title' className='shift-left comp-msg-title'>
                    {messageHelper.getMessageHeader(this.props.messageType)}
                </h3>
                {this.sendButton()}
                <div className={classNames(
                    'minimize-message',
                    { 'shift-left': this.props.messageType === enums.MessageType.ResponseDetails },
                    { 'shift-right': this.props.messageType === enums.MessageType.ResponseCompose })}>
                    <a href='javascript:void(0)' className='minimize-message-link' id='message-minimize'
                        title={localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip')}
                        onClick={this.onMinimize}>
                        <span className='minimize-icon lite'>Minimize</span>
                    </a>
                    <a href='javascript:void(0)' className='maximize-message-link' id='message-maximize'
                        title={localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip')}
                        onClick={this.onMaximize}>
                        <span className='maxmize-icon lite'>
                            {localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip')}
                        </span>
                    </a>
                    <a href='javascript:void(0)' className='close-message-link'
                        title={localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip')}
                        id='message-close' onClick={this.onMessageClose}>
                        <span className='close-icon lite'>Close</span>
                    </a>
                </div>
            </div>
        );
    }

    /**
     * Send Button in compose Message
     */
    private sendButton() {
        if (this.props.messageType !== enums.MessageType.ResponseDetails) {
            return (
                <div className='shift-left comp-msg-butons'>
                    <GenericButton
                        id={'message_send_btn'}
                        key={'key_message_send_btn'}
                        className={'button primary rounded'}
                        title={localeStore.instance.TranslateText('messaging.compose-message.send-button-tooltip')}
                        content={localeStore.instance.TranslateText('messaging.compose-message.send-button')}
                        disabled={this.isSendButtonDisabled}
                        onClick={() => { this.messageSendValidationCheck(this.props.messageType); }} />
                </div>
            );
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromResponse);
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent);
        window.addEventListener('click', this._boundHandleOnClick);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        messageHelper.addInitMouseClickEventScriptBlock();
        messageStore.instance.addListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        teamManagementStore.instance.addListener
            (teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromResponse);
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent);
        window.removeEventListener('click', this._boundHandleOnClick);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        if (messageStore.instance.messageViewAction !== enums.MessageViewAction.None) {
            messagingActionCreator.messageAction(enums.MessageViewAction.None);
        }
        messageHelper.removeInitMouseClickEventScriptBlock();
        messageStore.instance.removeListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        teamManagementStore.instance.removeListener
            (teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    }

    /**
     * componentWillReceiveProps
     * @param nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        // set to field values
        if (markerOperationModeFactory.operationMode.sendMessageToExaminer(nextProps.messageType)) {
            this.toFieldValues = new Array<string>();
			this.toFieldIds = new Array<number>();
			let _currentExaminerId: number = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
				standardisationSetupStore.instance.getProvisionalExaminerId(markingStore.instance.selectedDisplayId) :
				teamManagementStore.instance.examinerDrillDownData.examinerId;
			let _currentExaminerName: string = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
				standardisationSetupStore.instance.getFormattedExaminerName(markingStore.instance.selectedDisplayId)
				: examinerStore.instance.getMarkerInformation.formattedExaminerName;
            this.toFieldIds.push(_currentExaminerId);
            this.toFieldValues.push(_currentExaminerName);
            this.currentExaminerName = _currentExaminerName;
            this.currentExaminerId = _currentExaminerId;
        } else if (nextProps.supervisorId > 0 && nextProps.supervisorName !== '') {
            this.toFieldValues = new Array<string>();
            this.toFieldIds = new Array<number>();
            this.toFieldIds.push(nextProps.supervisorId);
            this.toFieldValues.push(nextProps.supervisorName);
            this.currentExaminerName = nextProps.supervisorName;
            this.currentExaminerId = nextProps.supervisorId;
        }

        // set variables for reply and forward
        if (this.props.messageType === enums.MessageType.ResponseDetails && (nextProps.messageType === enums.MessageType.ResponseReply ||
            nextProps.messageType === enums.MessageType.ResponseForward)) {
            this.setvariablesForReplyAndForward(nextProps.messageType);
        }
    }

    /**
     * This function gets invoked when the component is about to be updated
     */
    public componentDidUpdate() {
        // enable or disable send button while changing props
        this.enableDisableSendButton();
    }

    /**
     * This method is handling the letious popup events.
     */
    private onPopUpDisplayEvent = (popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType,
        popUpDisplayAction, actionFromCombinedPopup: boolean = false,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none) => {
        switch (popUpType) {
            case enums.PopUpType.DiscardMessage:
            case enums.PopUpType.DiscardMessageNavigateAway:
            case enums.PopUpType.DiscardOnNewMessageButtonClick:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        popupHelper.handlePopUpEvents(popUpType, popUpActionType, this.onDiscardMessageConfirmed,
                            actionFromCombinedPopup, navigateTo);
                        break;
                    case enums.PopUpActionType.No:
                        popupHelper.handlePopUpEvents(popUpType, popUpActionType, this.onDiscardMessageCancelled);
                        break;
                }
        }
    };

    /**
     * Close the message panel after deleting the message
     */
    private updateMessageDeletedStatus() {
        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
    }

    /**
     * This method will return the supervisor details against a qig
     */
    private getSupervisorAndQIGDetails = (qigId: number) => {
        let item: Item = this.qigListItems.filter((x: Item) => x.id === qigId)[0];
        if (item) {
            this.selectedQigItemId = item.id;
            this.selectedQigItemDisplayed = item.name;
            this.supervisorName = item.parentExaminerDisplayName;
            this.supervisorId = item.parentExaminerId;
            this.selectedQuestionPaperPartId = item.questionPaperPartId;
        }
    };

    /**
     * Handles the action event on To address list Received.
     */
    private teamListReceived = () => {
        if (markerOperationModeFactory.operationMode.isRemoveMandatoryMessagePriorityRequired(this.currentExaminerId)) {
            let teams = messageStore.instance.teamDetails;
            if (teams) {
                if (teams.team.subordinates && teams.team.subordinates.length > 0) {
                    if (this.props.messageType === enums.MessageType.ResponseReply) {
                        this.removeMandatoryMessagePriority = true;
                        this.getSubordinateList(teams.team.subordinates);
                    }
                }
                if (teams && teams.team.subordinates && teams.team.subordinates.length === 0) {
                    this.removeMandatoryMessagePriority = true;
                }
            }
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Get selected subordinated list.
     */
    private getSubordinateList(teamList: Array<ExaminerInfo>) {
        let that = this;
        teamList.map(function (examinerInfo: ExaminerInfo) {
            if (examinerInfo.examinerId === that.props.selectedMessage.fromExaminerId) {
                that.removeMandatoryMessagePriority = false;
            }
            if (examinerInfo.subordinates.length > 0) {
                that.getSubordinateList(examinerInfo.subordinates);
            }
        });
    }

    /**
     * to show or hide mandatory message priority
     */
    private doShowMandatoryMessagePriority(): boolean {
        let currentExaminerApprovalStatus = enums.ExaminerApproval.None;
        if (examinerStore && examinerStore.instance.getMarkerInformation) {
            currentExaminerApprovalStatus = examinerStore.instance.getMarkerInformation.currentExaminerApprovalStatus;
        }

        if (currentExaminerApprovalStatus === enums.ExaminerApproval.NotApproved ||
            currentExaminerApprovalStatus === enums.ExaminerApproval.Suspended ||
            this.currentExaminerId === examinerStore.instance.parentExaminerId) {
            this.removeMandatoryMessagePriority = true;
        } else if ((markerOperationModeFactory.operationMode.isTeamManagementMode &&
            this.props.messageType === enums.MessageType.ResponseCompose)) {
            this.removeMandatoryMessagePriority = false;
        } else if (worklistStore.instance.isMarkingCheckMode && currentExaminerApprovalStatus === enums.ExaminerApproval.Approved &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer) {

            // Mandatory message option should be visible from Marking check is doing from parent.
            this.removeMandatoryMessagePriority = false;
        }
        return this._mandatoryMessagesFromMarkingToolCC && !this.removeMandatoryMessagePriority;
    }

    /**
     * This method will set the subject and message body for reply and forward
     */
    private setvariablesForReplyAndForward = (messageType: enums.MessageType) => {
        this.priorityDropdownSelectedItem = messageHelper.getPriorityDropDownSelectedItem(this.props.selectedMessage.priorityName);
        switch (messageType) {
            case enums.MessageType.ResponseReply:
            case enums.MessageType.ResponseForward:
                this.messageSubject = messageHelper.getSubjectContent(messageType, this.props.selectedMessage.subject);
                this.messageBody = messageHelper.getMessageContent(messageType,
                    this.props.selectedMessage.examinerDetails.fullName, this.props.selectedMessage.displayDate,
                    this.props.selectedMsgDetails.body);
                if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                    let qigId: number = operationModeHelper.markSchemeGroupId;
                    let examinerRoleId: number = operationModeHelper.authorisedExaminerRoleId;
                    let args: teamArgument = {
                        examinerRoleId: examinerRoleId,
                        qigId: qigId
                    };
                    messagingActionCreator.getTeamDetails(args);
                }
                break;
        }
    };

    /**
     * This method will call on message open
     */
    private onMessagePanelOpen = (messageType: enums.MessageType) => {
        if (messageType === enums.MessageType.ResponseCompose) {
            this.messageBody = messageHelper.getMessageContent(enums.MessageType.ResponseCompose);
            // Reset the Navigation after opening a message
            this.navigateTo = enums.SaveAndNavigate.none;
            this.setState({ renderedOn: Date.now() });
        }
    };
}


export = Message;