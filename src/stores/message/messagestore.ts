import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import ActionType = require('../../actions/base/actiontypes');
import actionNotificationInfo = require('../../actions/backgroundpulse/notificationinfo/actionnotificationinfo');
import backgroundPulseAction = require('../../actions/backgroundpulse/backgroundpulseaction');
import sendMessageAction = require('../../actions/messaging/sendmessageaction');
import enums = require('../../components/utility/enums');
import messageViewAction = require('../../actions/messaging/messageviewaction');
import popUpDisplayAction = require('../../actions/popupdisplay/popupdisplayaction');
import MessageAction = require('../../actions/messaging/messageaction');
import messageBodyDetailsGetAction = require('../../actions/messaging/messagebodydetailsgetaction');
import messageStatusUpdateAction = require('../../actions/messaging/messagestatusupdateaction');
import getUnreadMandatoryMessageStatusAction = require('../../actions/messaging/getunreadmandatorymessagestatusaction');
import refreshMessageFolderAction = require('../../actions/messaging/refreshmessagefolderaction');
import messageNavigateAction = require('../../actions/messaging/messagenavigateaction');
import responseOpenAction = require('../../actions/response/responseopenaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import getTeamAction = require('../../actions/messaging/getteamaction');
import TeamReturn = require('./typings/teamreturn');
import teamListPopupHelper = require('../../components/utility/message/teamlistpopuphelper');
import updateTeamListAction = require('../../actions/messaging/updateteamlistaction');
import entireTeamListChecked = require('../../actions/messaging/entireteamlistcheckedaction');
import updateSelectedTeamList = require('../../actions/messaging/updateselectedteamlistaction');
import clearTeamListSelectionAction = require('../../actions/messaging/clearteamlistselectionaction');
import mandatoryMessageValidationPopupAction = require('../../actions/messaging/mandatorymessagevalidationpopupaction');
import updateMessagePriorityAction = require('../../actions/messaging/updatemessagepriorityaction');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import messagePanelClickedAction = require('../../actions/messaging/messagepanelclickedaction');
import constants = require('../../components/utility/constants');

/**
 * Class for message store.
 */
class MessageStore extends storeBase {

    public static UPDATE_NOTIFICATION_TRIGGERED_EVENT = 'updatenotificationevent';
    public static SEND_MESSAGE_SUCCESS_EVENT = 'sendmessagesuccessevent';
    public static SEND_MESSAGE_ERROR_EVENT = 'sendmessageerrorevent';
    public static CALCULATE_RECIPIENT_COUNT_EVENT = 'calculaterecipientcountevent';
    // messaging section opened event
    public static MESSAGE_OPEN_EVENT = 'messageopenevent';
    // messaging section closed event
    public static MESSAGE_CLOSE_EVENT = 'messagecloseevent';
    // messaging section navigate away event
    public static MESSAGE_NAVIGATE_EVENT = 'messagenavigateevent';
    // popup displaying event
    public static POPUP_DISPLAY_EVENT = 'popupdisplayevent';
    // messaging section minimized event
    public static MESSAGE_MINIMIZE_EVENT = 'messageminimizeevent';
    // messaging section maximized event
    public static MESSAGE_MAXIMIZE_EVENT = 'messagemaximizeevent';
    // Message data received event
    public static MESSAGE_RECEIVED = 'MessagesReceived';
    // Message Details data received event
	public static MESSAGE_DETAILS_RECEIVED = 'MessagesDetailsReceived';
	// If message details has been failed
	public static MESSAGE_DETAILS_RECEIVED_FAILED = 'MessagesDetailsReceivedFailed';
    // Message data received event for the response
    public static RESPONSE_MESSAGE = 'ResponseMessagesReceived';
    // unread mandatory message status event
    public static UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED = 'UnreadMandatoryMessageStatusUpdated';
    // refresh inbox upon unread mandatory message received
    public static REFRESH_MESSAGE_TAB = 'RefreshMessageTab';
    //Event when navigated away from message
    public static MESSAGE_NAVIGATION_EVENT = 'MessageNavigationEvent';

    // Message deleted event
    public static MESSAGE_DELETE_EVENT = 'messagedeletedevent';
    // Message deleted event
    public static MESSAGE_DELETE_CLICK_EVENT = 'messagedeleteclickevent';

    /* Response Data Received Event*/
    public static RESPONSE_DATA_RECEIVED_EVENT = 'ResponseDataReceivedEvent';

    /* To address details received event */
    public static TEAM_LIST_RECEIVED = 'TeamListReceived';

    /* team list updated event */
    public static TEAM_LIST_UPDATED = 'TeamListUpdated';

    /* Update address list received event */
    public static UPDATE_TEAM_LIST_RECEIVED = 'UpdateTeamListReceived';

    /* Mandatory message validation popup event */
    public static MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT = 'MandatoryMessageValidationPopupEvent';

    /* Update message priority event */
    public static UPDATE_MESSAGE_PRIORITY_EVENT = 'UpdateMessagePriorityEvent';

    public static RESPONSE_DATA_RECEIVED_FAILED_EVENT = 'ResponseDataReceivedFailedEvent';

    private success: boolean;
    private notificationData: actionNotificationInfo;
    private _messageViewAction: enums.MessageViewAction = enums.MessageViewAction.None;
    private _previousMessageViewAction: enums.MessageViewAction = enums.MessageViewAction.None;
    private _messages: Immutable.List<Message>;
    private _messageDetails: MessageDetails[] = [];
    private _messageMarkSchemes: Immutable.List<MessagingMarkScheme>;
    // Holds the local collection for the changed message Ids.
    private newlyReadMessageIds: Number[] = [];
    private newlyDeletedMessageIds: Number[] = [];
    // Holding the message collections needs to be updated or Not
    private _isMessageDataRequireUpdation: boolean = false;
    private _newExaminerRolecreatedForAdminRemarker: boolean = false;
    private _unreadMessageCount: number = 0;
    /* Navigating from response to different view */
    private _navigatingFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none;
    private _isUnreadMandatoryMessagePresent: boolean = false;
    private _messageFolderRefreshed: boolean = false;
    private _responseOpenTriggerPoint: enums.TriggerPoint = enums.TriggerPoint.None;
    private _searchedResponseData: SearchedResponseData;
    private _unreadMandatoryMessageCount: number = 0;
    private _teamList: TeamReturn;
    private _updatedTeamList: TeamReturn;
    private _isMessageSidePanelClicked: boolean;
    /*to validate if message panel is opened*/
    private _messageOpened: boolean;
    private _isSupervisorRemarkRequestCreated: boolean = false;
    /**
     * @constructor
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case ActionType.BACKGROUND_PULSE:
                    this.success = (action as backgroundPulseAction).success;
                    if (this.success) {
                        this.notificationData = (action as backgroundPulseAction).getNotificationData;
                        let isMessageReadCountChanged: boolean = this._unreadMessageCount !==
                            (this.notificationData !== undefined ? this.notificationData.getUnreadMessageCount : 0);
                        this._isMessageDataRequireUpdation = isMessageReadCountChanged;
                        this._unreadMessageCount = this.notificationData !== undefined ? this.notificationData.getUnreadMessageCount : 0;
                        this._unreadMandatoryMessageCount = this.notificationData ?
                            this.notificationData.getUnreadMandatoryMessageCount : 0;
                        // set the _isUnreadMandatoryMessagePresent as true for getting the message from server.
                        this._isUnreadMandatoryMessagePresent = this._unreadMandatoryMessageCount > 0 ? true : false;
                        this.emit(MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this._unreadMessageCount, isMessageReadCountChanged,
                            this._unreadMandatoryMessageCount);
                    }
                    break;
                case ActionType.SEND_MESSAGE_ACTION:
                    let sendMessageAction = (action as sendMessageAction);
                    let success: boolean = sendMessageAction.success;
                    if (success) {
                        this._isMessageDataRequireUpdation = true;
                        //this is to clear the existing selection of team list
                        if (this._teamList) {
                            teamListPopupHelper.getTreeViewTeamList(this._teamList, sendMessageAction.examinerRoleId);
                            this._updatedTeamList = this._teamList;
                        }

                        // If cache got removed, it should remove from local collection.
                        if (sendMessageAction.shouldClearMessageDetails) {
                            this._messageDetails = [];
                        }

                        this.emit(MessageStore.SEND_MESSAGE_SUCCESS_EVENT);
                    } else {
                        /* Emitting error event on the error code returing form the API on custom SQL exception */
                        if (sendMessageAction.messageSendErrorCode === constants.MESSAGE_SEND_SQL_ERROR_CODE) {
                            this.emit(MessageStore.SEND_MESSAGE_ERROR_EVENT);
                        }
                    }
                    break;
                case ActionType.MESSAGE_ACTION:
                    this._previousMessageViewAction = this.messageViewAction;
                    this._messageViewAction = (action as messageViewAction).messageAction;
                    switch (this.messageViewAction) {
                        case enums.MessageViewAction.Open:
                            this._messageOpened = true;
                            this.emit(MessageStore.MESSAGE_OPEN_EVENT, (action as messageViewAction).messageType);
                            break;
                        case enums.MessageViewAction.Close:
                            // Added to know whether the close message call is from action or not
                            this.emit(MessageStore.MESSAGE_CLOSE_EVENT, true);
                            break;
                        case enums.MessageViewAction.NavigateAway:
                            // set the previous message view action in the case of navigate away
                            // we will check current message view action for showing discard message (open, minimised, maximised etc)
                            this._messageViewAction = this._previousMessageViewAction;
                            let navigateTo: enums.SaveAndNavigate = (action as messageViewAction).navigateTo;
                            this._navigatingFrom = (action as messageViewAction).navigateFrom;
                            this.emit(MessageStore.MESSAGE_NAVIGATE_EVENT, navigateTo);
                            break;
                        case enums.MessageViewAction.Minimize:
                            this.emit(MessageStore.MESSAGE_MINIMIZE_EVENT);
                            break;
                        case enums.MessageViewAction.Maximize:
                            this.emit(MessageStore.MESSAGE_MAXIMIZE_EVENT);
                            break;
                        case enums.MessageViewAction.Delete:
                            this.emit(MessageStore.MESSAGE_DELETE_CLICK_EVENT, true);
                            break;
                    }
                    break;
                case ActionType.POPUPDISPLAY_ACTION:
                    let popUpDisplayAction = (action as popUpDisplayAction);
                    let popupType = popUpDisplayAction.getPopUpType;
                    let actionType = popUpDisplayAction.getPopUpActionType;
                    this._navigatingFrom = popUpDisplayAction.navigateFrom;
                    let navigateTo = popUpDisplayAction.navigateTo;
                    let popUpData = popUpDisplayAction.getPopUpData;
                    this.emit(MessageStore.POPUP_DISPLAY_EVENT, popupType,
                        actionType, popUpData, popUpDisplayAction.actionFromCombinedPopup, navigateTo);
                    break;
                case ActionType.GET_MESSAGE_ACTION:
                    let selectedMessageId: number = 0;
                    let getMessagesAction = (action as MessageAction);
                    let filteredMessages = getMessagesAction.messages.filter(x =>
                        getMessagesAction.hiddenQigList.indexOf(x.markSchemeGroupId) === -1).toList();
                    this._messages = filteredMessages;
                    this._newExaminerRolecreatedForAdminRemarker = false;
                    // If the messages loaded against the response, raise RESPONSE_MESSAGE event.
                    if (getMessagesAction.responseId > 0) {
                        if (this._responseOpenTriggerPoint === enums.TriggerPoint.WorkListResponseMessageIcon) {
                            // set the selected response messageId
                            selectedMessageId = this.selectedResponseMessageId;
                        } else if (this._searchedResponseData !== undefined &&
                            // If Quality feedback pending for the logged in user, should not open message while opening response.
                            (!this._searchedResponseData.hasQualityFeedbackOutstanding ||
                                this._searchedResponseData.examinerRoleId !== this._searchedResponseData.loggedInExaminerRoleId)) {
                            selectedMessageId = this._searchedResponseData.messageId;
                        }
                        let isMessageReadCountChanged: boolean = this._unreadMessageCount !== getMessagesAction.getTotalUnreadMessageCount;
                        this.emit(MessageStore.RESPONSE_MESSAGE, isMessageReadCountChanged, selectedMessageId);
                        this._searchedResponseData = undefined;
                        // Reset the triggering point after opening the response
                        this._responseOpenTriggerPoint = enums.TriggerPoint.None;
                        break;
                    } else if (getMessagesAction.messageFolderType === enums.MessageFolderType.Inbox) {
                        // New List of Messages Received from Server. Reset the local read status collection and update the unread count
                        if (!getMessagesAction.isResultFromCache) {
                            this.newlyReadMessageIds = [];
                            this._unreadMessageCount =
                                this.messages.filter((x: Message) => x.status === enums.MessageReadStatus.New).count();
                        }
                    }

                    // set the selected messageId
                    selectedMessageId = this.selectedMandatoryMessageId;

                    // if messages are loaded in inbox and its not loaded on mandatory message view popup click then show the mandatory
                    // message view popup
                    // hasUnReadMandatoryMessages - will check mandatory messages are available or not in messages collection
                    // isUnreadMandatoryMessagePresent, messageFolderRefreshed - check whether the get message action is called based on
                    //                                                            the OK click of a mandatory message popup
                    if (!getMessagesAction.responseId && this.hasUnReadMandatoryMessages && !this.isUnreadMandatoryMessagePresent &&
                        !this._messageFolderRefreshed) {
                        let showUnreadMandatoryMessagePopUp = getMessagesAction.checkUnreadMandatoryMessage;
                        this.emit(MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED,
                            showUnreadMandatoryMessagePopUp,
                            enums.TriggerPoint.MessageStore);
                        // reset isMandatoryMessagePopupDisplayed variable
                        this._isUnreadMandatoryMessagePresent = false;
                    }

                    let filteredMarkSchemes = getMessagesAction.messageMarkSchemes.filter(x =>
                        getMessagesAction.hiddenQigList.indexOf(x.markSchemeGroupId) === -1).toList();
                    this._messageMarkSchemes = filteredMarkSchemes;

                    // Setting the flag as true, for getting the data from Server after user sends a message
                    if (getMessagesAction.messageFolderType === enums.MessageFolderType.Sent) {
                        this._isMessageDataRequireUpdation = false;
                    } else if (getMessagesAction.messageFolderType === enums.MessageFolderType.Deleted) {
                        this.newlyDeletedMessageIds = [];
                    }

                    // reset message folder refreshed variable
                    this._messageFolderRefreshed = false;
                    this.emit(MessageStore.MESSAGE_RECEIVED, selectedMessageId);
                    break;
                case ActionType.MESSAGE_DETAILS_GET_ACTION:
					let messagesDetailsGetAction = (action as messageBodyDetailsGetAction);

					if (!messagesDetailsGetAction.success) {
						this.emit(MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED);
						return;
					}

                    if (messagesDetailsGetAction.selectedTab === enums.MessageFolderType.None) {
                        this._messageViewAction = enums.MessageViewAction.View;
                    }

                    let messageRecieved = messagesDetailsGetAction.messageDetails;
                    // if message already exist, update it. Else push
                    let itemExist = this._messageDetails.some((messageDetails: MessageDetails) =>
                        messageDetails.examinerMessageId === messageRecieved.examinerMessageId);
                    if (itemExist) {
                        this._messageDetails.forEach((messageDetails: MessageDetails) => {
                            if (messageDetails.examinerMessageId === messageRecieved.examinerMessageId) {
								messageDetails.hasPermissionToDisplayId = messageRecieved.hasPermissionToDisplayId;
								messageDetails.markingModeId = messageRecieved.markingModeId;
								messageDetails.displayId = messageRecieved.displayId;
                            }
                        });
                    } else {
                        this._messageDetails.push(messagesDetailsGetAction.messageDetails);
                    }
                    this.emit(MessageStore.MESSAGE_DETAILS_RECEIVED, messagesDetailsGetAction.messageDetails.examinerMessageId);
                    break;
                case ActionType.MESSAGE_STATUS_UPDATE_ACTION:
                    let messageStatusUpdateAction = (action as messageStatusUpdateAction);
                    if (messageStatusUpdateAction.messageStatus === enums.MessageReadStatus.Closed) {
                        this._isMessageDataRequireUpdation = true;
                        this.emit(MessageStore.MESSAGE_DELETE_EVENT);
                        this.newlyDeletedMessageIds.push(messageStatusUpdateAction.messagId);
                    }
                    this.newlyReadMessageIds.push(messageStatusUpdateAction.messagId);
                    this._unreadMessageCount--;
                    break;
                case ActionType.GET_UNREAD_MANDATORY_MESSAGE_STATUS:
                    let unreadMandatoryMessageStatusAction: getUnreadMandatoryMessageStatusAction =
                        (action as getUnreadMandatoryMessageStatusAction);
                    this._isUnreadMandatoryMessagePresent = unreadMandatoryMessageStatusAction.isUnreadMandatoryMessagePresent;
                    this.emit(MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED, this.isUnreadMandatoryMessagePresent,
                        unreadMandatoryMessageStatusAction.triggerPoint);
                    break;
                case ActionType.REFRESH_MESSAGE_FOLDER:
                    let refreshMessageTabAction: refreshMessageFolderAction = action as refreshMessageFolderAction;
                    this._messageFolderRefreshed = true;
                    if (!refreshMessageTabAction.useCache) {
                        this._isMessageDataRequireUpdation = true;
                    }
                    this.emit(MessageStore.REFRESH_MESSAGE_TAB, enums.MessageFolderType.Inbox);
                    break;
                case ActionType.MESSAGE_NAVIGATE_ACTION:
                    let messageNavigationAction = (action as messageNavigateAction);
                    this.emit(MessageStore.MESSAGE_NAVIGATION_EVENT, messageNavigationAction.messageNavigationArguments);
                    break;
                case ActionType.OPEN_RESPONSE:
                    let openAction: responseOpenAction = action as responseOpenAction;
                    this._responseOpenTriggerPoint = openAction.triggerPoint;
                    //reset message collection when open Response #57273
                    this._messages = undefined;
                    break;
                case ActionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    this._searchedResponseData = responseDataGetAction.searchedResponseData;
                    if (this._searchedResponseData &&
                        this._searchedResponseData.triggerPoint !== enums.TriggerPoint.DisplayIdSearch) {
                        this._isMessageDataRequireUpdation =
                            (this._searchedResponseData.approvalStatusId === enums.ExaminerApproval.Withdrawn ||
                                this._isSupervisorRemarkRequestCreated);
                        if (this._searchedResponseData.questionPaperId === 0) {
                            this.emit(MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT);
                        } else {
                            this.emit(MessageStore.RESPONSE_DATA_RECEIVED_EVENT, responseDataGetAction.searchedResponseData);
                        }
                    }
                    break;
                case ActionType.GET_TEAM_ACTION:
                    let teamDetailsAction = (action as getTeamAction);
                    this._teamList = teamDetailsAction.team;
                    teamListPopupHelper.getTreeViewTeamList(this._teamList, teamDetailsAction.examinerRoleId);
                    this._updatedTeamList = JSON.parse(JSON.stringify(this._teamList));
                    this.emit(MessageStore.TEAM_LIST_RECEIVED);
                    break;
                case ActionType.UPDATE_TEAM_LIST_ACTION:
                    let _updateTeamListAction = (action as updateTeamListAction);
                    this._updatedTeamList = teamListPopupHelper.updateTeamList(
                        this._updatedTeamList,
                        _updateTeamListAction.examinerRoleId,
                        _updateTeamListAction.isExpand);
                    this.emit(MessageStore.TEAM_LIST_UPDATED, false, _updateTeamListAction.isExpand);
                    break;
                case ActionType.ENTIRE_TEAM_LIST_CHECKED_ACTION:
                    let entireTeamChecked = (action as entireTeamListChecked);
                    this._updatedTeamList = teamListPopupHelper.selectEntireTeam(this._updatedTeamList, entireTeamChecked.isChecked);
                    this.emit(MessageStore.TEAM_LIST_UPDATED, true);
                    break;
                case ActionType.UPDATE_SELECTED_TEAM_LIST_ACTION:
                    let updateSelectedList = (action as updateSelectedTeamList);
                    if (updateSelectedList.isSaved) {
                        this._teamList = JSON.parse(JSON.stringify(this._updatedTeamList));
                    } else {
                        this._updatedTeamList = JSON.parse(JSON.stringify(this._teamList));
                    }
                    this.emit(MessageStore.UPDATE_TEAM_LIST_RECEIVED, updateSelectedList.isSaved);
                    break;
                case ActionType.CLEAR_TEAM_LIST_SELECTION_ACTION:
                    teamListPopupHelper.getTreeViewTeamList(this._teamList, (action as clearTeamListSelectionAction).examinerRoleId);
                    break;
                case ActionType.MANDATORY_MESSAGE_VALIDATION_POPUP_ACTION:
                    this.emit(MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT);
                    break;
                case ActionType.UPDATE_MESSAGE_PRIORITY_ACTION:
                    this.emit(MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT);
                    break;
                case ActionType.CALCULATE_RECIPIENT_COUNT_ACTION:
                    this.emit(MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT);
                    break;
                case ActionType.CREATE_EXAMINER_ROLE_FOR_ADMIN_REMARKER:
                    this._newExaminerRolecreatedForAdminRemarker = true;
                    break;
                case ActionType.MESSAGE_PANEL_CLICKED_ACTION:
                    this._isMessageSidePanelClicked = (action as messagePanelClickedAction).isMessageSidePanelOpen;
                    break;
                case ActionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    this._isSupervisorRemarkRequestCreated = true;
                    break;
            }
        });
    }

    /*
     * returns the searched response data
     */
    public get searchResponseData() {
        return this._searchedResponseData;
    }

    /*
     * returns the notification data
     */
    public get getNotificationData() {
        return this.notificationData;
    }

    /*
     * returns the unread message count
     */
    public get getUnreadMessageCount() {
        return this._unreadMessageCount;
    }

    /*
    * returns the exception message count
    */
    public get getExceptionMessageCount() {
        return this.notificationData !== undefined ? this.notificationData.getExceptionMessageCount : 0;
    }

    /**
     * returns the current message view action
     */
    public get messageViewAction() {
        return this._messageViewAction;
    }

    /**
     * returns true if message panel is open, minimized or maximized
     */
    public get isMessagePanelActive(): boolean {
        return this.messageViewAction === enums.MessageViewAction.Open || this.messageViewAction === enums.MessageViewAction.Minimize ||
            this.messageViewAction === enums.MessageViewAction.Maximize;
    }

    /**
     * returns true if message panel is open or maximized
     */
    public get isMessagePanelVisible(): boolean {
        return this.messageViewAction === enums.MessageViewAction.Open || this.messageViewAction === enums.MessageViewAction.View ||
            this.messageViewAction === enums.MessageViewAction.Maximize;
    }

    /**
     * Get the messages
     */
    public get messages() {
        return this._messages;
    }

    /**
     * Get the messages mark schemes
     */
    public get messagesMarkSchemes() {
        return this._messageMarkSchemes;
    }

    /**
     * returns true if message is sent- flag used to determine whether to reload sent messages from the db
     */
    public get isMessageDataRequireUpdation(): boolean {
        return this._isMessageDataRequireUpdation;
    }

    /**
     * returns true if new examiner role is created for the admin remarker-
     * flag used to determine whether to reload sent messages from the db
     */
    public get isNewExaminerRoleCreated(): boolean {
        return this._newExaminerRolecreatedForAdminRemarker;
    }

    /**
     * Get the message details based on the message
     * @param msgId
     */
    public getMessageDetails(msgId: Number): MessageDetails {
        for (let arrayIndex = 0; arrayIndex < this._messageDetails.length; arrayIndex++) {
            if (this._messageDetails[arrayIndex]) {
                if (this._messageDetails[arrayIndex].examinerMessageId === msgId) {
                    return this._messageDetails[arrayIndex];
                }
            }
        }

        return null;
    }

    /**
     * Get the message data based on the message id
     * @param msgId
     */
    public getMessageData(msgId: Number): Message {
        return this._messages.filter((message: Message) => message.examinerMessageId === msgId).first();
    }

    /**
     * Check the message is read or not
     * @param msgId
     */
    public isMessageRead(msgId: Number): boolean {
        return this.newlyReadMessageIds.indexOf(msgId) >= 0;
    }

    /**
     * Check any message has been deleted
     */
    public isMessageDeleted(): boolean {
        return this.newlyDeletedMessageIds.length !== 0;
    }

    /**
     * Getting where to the navigation happening
     */
    public get navigateFrom(): number {
        return this._navigatingFrom;
    }

    /**
     * Return the previous message view action
     */
    public get previousMessageViewAction(): enums.MessageViewAction {
        return this._previousMessageViewAction;
    }

    /**
     * Returns true if unread mandatory messages are available else return false
     */
    public get isUnreadMandatoryMessagePresent(): boolean {
        return this._isUnreadMandatoryMessagePresent;
    }

    /**
     * return the most recent unread mandatory messageId
     */
    public get selectedMandatoryMessageId(): number {
        let selectedMandatoryMessageId: number = 0;
        if (this.messages && this.messages.count() > 0) {
            let message: Message = this.messages.filter((x: Message) => x.status === enums.MessageReadStatus.New &&
                x.priorityName.toLowerCase() === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory).toLowerCase()
                && x.messageFolderType === enums.MessageFolderType.Inbox
                && !this.isMessageRead(x.examinerMessageId)).first();
            if (message) {
                selectedMandatoryMessageId = message.examinerMessageId;
            }
        }

        return selectedMandatoryMessageId;
    }

    /**
     * Check whether unread mandatory messages are available or not
     */
    public get hasUnReadMandatoryMessages(): boolean {
        if (this.messages && this.messages.count() > 0) {
            return this.messages.filter((x: Message) => x.status === enums.MessageReadStatus.New &&
                x.priorityName.toLowerCase() === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory).toLowerCase()
                && x.messageFolderType === enums.MessageFolderType.Inbox
                && !this.isMessageRead(x.examinerMessageId)).count() > 0;
        }

        return false;
    }

    /**
     * return the most recent unread response messageId
     */
    public get selectedResponseMessageId(): number {
        let selectedMandatoryMessageId: number = 0;
        if (this.messages && this.messages.count() > 0) {
            let message: Message = this.messages.filter((x: Message) => x.status === enums.MessageReadStatus.New
                && !this.isMessageRead(x.examinerMessageId)).first();
            // if unread messages are available then set the recent unread messageId else take the first one
            selectedMandatoryMessageId = message ? message.examinerMessageId : this.messages.first().examinerMessageId;
        }

        return selectedMandatoryMessageId;
    }

    /**
     * Returns the open response trigger point
     */
    public get responseOpenTriggerPoint(): enums.TriggerPoint {
        return this._responseOpenTriggerPoint;
    }

    /**
     * Returns the team list details.
     */
    public get teamDetails(): TeamReturn {
        return this._updatedTeamList;
    }

    /**
     * Get LHS messgae panel open status
     */
    public get isMessageSidePanelOpen(): boolean {
        return this._isMessageSidePanelClicked;
    }

    /**
     * Get message panel open status
     */
    public get isMessagePanelOpened(): boolean {
        return this._messageOpened;
    }
}

let instance = new MessageStore();

export = { MessageStore, instance };