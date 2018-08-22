"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var ActionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
var teamListPopupHelper = require('../../components/utility/message/teamlistpopuphelper');
var constants = require('../../components/utility/constants');
/**
 * Class for message store.
 */
var MessageStore = (function (_super) {
    __extends(MessageStore, _super);
    /**
     * @constructor
     */
    function MessageStore() {
        var _this = this;
        _super.call(this);
        this._messageViewAction = enums.MessageViewAction.None;
        this._previousMessageViewAction = enums.MessageViewAction.None;
        this._messageDetails = [];
        // Holds the local collection for the changed message Ids.
        this.newlyReadMessageIds = [];
        this.newlyDeletedMessageIds = [];
        // Holding the message collections needs to be updated or Not
        this._isMessageDataRequireUpdation = false;
        this._newExaminerRolecreatedForAdminRemarker = false;
        this._unreadMessageCount = 0;
        /* Navigating from response to different view */
        this._navigatingFrom = enums.SaveAndNavigate.none;
        this._isUnreadMandatoryMessagePresent = false;
        this._messageFolderRefreshed = false;
        this._responseOpenTriggerPoint = enums.TriggerPoint.None;
        this._unreadMandatoryMessageCount = 0;
        this._isSupervisorRemarkRequestCreated = false;
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case ActionType.BACKGROUND_PULSE:
                    _this.success = action.success;
                    if (_this.success) {
                        _this.notificationData = action.getNotificationData;
                        var isMessageReadCountChanged = _this._unreadMessageCount !==
                            (_this.notificationData !== undefined ? _this.notificationData.getUnreadMessageCount : 0);
                        _this._isMessageDataRequireUpdation = isMessageReadCountChanged;
                        _this._unreadMessageCount = _this.notificationData !== undefined ? _this.notificationData.getUnreadMessageCount : 0;
                        _this._unreadMandatoryMessageCount = _this.notificationData ?
                            _this.notificationData.getUnreadMandatoryMessageCount : 0;
                        // set the _isUnreadMandatoryMessagePresent as true for getting the message from server.
                        _this._isUnreadMandatoryMessagePresent = _this._unreadMandatoryMessageCount > 0 ? true : false;
                        _this.emit(MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, _this._unreadMessageCount, isMessageReadCountChanged, _this._unreadMandatoryMessageCount);
                    }
                    break;
                case ActionType.SEND_MESSAGE_ACTION:
                    var sendMessageAction_1 = action;
                    var success = sendMessageAction_1.success;
                    if (success) {
                        _this._isMessageDataRequireUpdation = true;
                        //this is to clear the existing selection of team list
                        if (_this._teamList) {
                            teamListPopupHelper.getTreeViewTeamList(_this._teamList, sendMessageAction_1.examinerRoleId);
                            _this._updatedTeamList = _this._teamList;
                        }
                        // If cache got removed, it should remove from local collection.
                        if (sendMessageAction_1.shouldClearMessageDetails) {
                            _this._messageDetails = [];
                        }
                        _this.emit(MessageStore.SEND_MESSAGE_SUCCESS_EVENT);
                    }
                    else {
                        /* Emitting error event on the error code returing form the API on custom SQL exception */
                        if (sendMessageAction_1.messageSendErrorCode === constants.MESSAGE_SEND_SQL_ERROR_CODE) {
                            _this.emit(MessageStore.SEND_MESSAGE_ERROR_EVENT);
                        }
                    }
                    break;
                case ActionType.MESSAGE_ACTION:
                    _this._previousMessageViewAction = _this.messageViewAction;
                    _this._messageViewAction = action.messageAction;
                    switch (_this.messageViewAction) {
                        case enums.MessageViewAction.Open:
                            _this._messageOpened = true;
                            _this.emit(MessageStore.MESSAGE_OPEN_EVENT, action.messageType);
                            break;
                        case enums.MessageViewAction.Close:
                            // Added to know whether the close message call is from action or not
                            _this.emit(MessageStore.MESSAGE_CLOSE_EVENT, true);
                            break;
                        case enums.MessageViewAction.NavigateAway:
                            // set the previous message view action in the case of navigate away
                            // we will check current message view action for showing discard message (open, minimised, maximised etc)
                            _this._messageViewAction = _this._previousMessageViewAction;
                            var navigateTo_1 = action.navigateTo;
                            _this._navigatingFrom = action.navigateFrom;
                            _this.emit(MessageStore.MESSAGE_NAVIGATE_EVENT, navigateTo_1);
                            break;
                        case enums.MessageViewAction.Minimize:
                            _this.emit(MessageStore.MESSAGE_MINIMIZE_EVENT);
                            break;
                        case enums.MessageViewAction.Maximize:
                            _this.emit(MessageStore.MESSAGE_MAXIMIZE_EVENT);
                            break;
                        case enums.MessageViewAction.Delete:
                            _this.emit(MessageStore.MESSAGE_DELETE_CLICK_EVENT, true);
                            break;
                    }
                    break;
                case ActionType.POPUPDISPLAY_ACTION:
                    var popUpDisplayAction_1 = action;
                    var popupType = popUpDisplayAction_1.getPopUpType;
                    var actionType = popUpDisplayAction_1.getPopUpActionType;
                    _this._navigatingFrom = popUpDisplayAction_1.navigateFrom;
                    var navigateTo = popUpDisplayAction_1.navigateTo;
                    var popUpData = popUpDisplayAction_1.getPopUpData;
                    _this.emit(MessageStore.POPUP_DISPLAY_EVENT, popupType, actionType, popUpData, popUpDisplayAction_1.actionFromCombinedPopup, navigateTo);
                    break;
                case ActionType.GET_MESSAGE_ACTION:
                    var selectedMessageId = 0;
                    var getMessagesAction = action;
                    _this._messages = getMessagesAction.messages;
                    _this._newExaminerRolecreatedForAdminRemarker = false;
                    // If the messages loaded against the response, raise RESPONSE_MESSAGE event.
                    if (getMessagesAction.responseId > 0) {
                        if (_this._responseOpenTriggerPoint === enums.TriggerPoint.WorkListResponseMessageIcon) {
                            // set the selected response messageId
                            selectedMessageId = _this.selectedResponseMessageId;
                        }
                        else if (_this._searchedResponseData !== undefined &&
                            // If Quality feedback pending for the logged in user, should not open message while opening response.
                            (!_this._searchedResponseData.hasQualityFeedbackOutstanding ||
                                _this._searchedResponseData.examinerRoleId !== _this._searchedResponseData.loggedInExaminerRoleId)) {
                            selectedMessageId = _this._searchedResponseData.messageId;
                        }
                        var isMessageReadCountChanged = _this._unreadMessageCount !== getMessagesAction.getTotalUnreadMessageCount;
                        _this.emit(MessageStore.RESPONSE_MESSAGE, isMessageReadCountChanged, selectedMessageId);
                        _this._searchedResponseData = undefined;
                        // Reset the triggering point after opening the response
                        _this._responseOpenTriggerPoint = enums.TriggerPoint.None;
                        break;
                    }
                    else if (getMessagesAction.messageFolderType === enums.MessageFolderType.Inbox) {
                        // New List of Messages Received from Server. Reset the local read status collection and update the unread count
                        if (!getMessagesAction.isResultFromCache) {
                            _this.newlyReadMessageIds = [];
                            _this._unreadMessageCount =
                                _this.messages.filter(function (x) { return x.status === enums.MessageReadStatus.New; }).count();
                        }
                    }
                    // set the selected messageId
                    selectedMessageId = _this.selectedMandatoryMessageId;
                    // if messages are loaded in inbox and its not loaded on mandatory message view popup click then show the mandatory
                    // message view popup
                    // hasUnReadMandatoryMessages - will check mandatory messages are available or not in messages collection
                    // isUnreadMandatoryMessagePresent, messageFolderRefreshed - check whether the get message action is called based on
                    //                                                            the OK click of a mandatory message popup
                    if (!getMessagesAction.responseId && _this.hasUnReadMandatoryMessages && !_this.isUnreadMandatoryMessagePresent &&
                        !_this._messageFolderRefreshed) {
                        var showUnreadMandatoryMessagePopUp = getMessagesAction.checkUnreadMandatoryMessage;
                        _this.emit(MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED, showUnreadMandatoryMessagePopUp, enums.TriggerPoint.MessageStore);
                        // reset isMandatoryMessagePopupDisplayed variable
                        _this._isUnreadMandatoryMessagePresent = false;
                    }
                    _this._messageMarkSchemes = getMessagesAction.messageMarkSchemes;
                    // Setting the flag as true, for getting the data from Server after user sends a message
                    if (getMessagesAction.messageFolderType === enums.MessageFolderType.Sent) {
                        _this._isMessageDataRequireUpdation = false;
                    }
                    else if (getMessagesAction.messageFolderType === enums.MessageFolderType.Deleted) {
                        _this.newlyDeletedMessageIds = [];
                    }
                    // reset message folder refreshed variable
                    _this._messageFolderRefreshed = false;
                    _this.emit(MessageStore.MESSAGE_RECEIVED, selectedMessageId);
                    break;
                case ActionType.MESSAGE_DETAILS_GET_ACTION:
                    var messagesDetailsGetAction = action;
                    if (!messagesDetailsGetAction.success) {
                        _this.emit(MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED);
                        return;
                    }
                    if (messagesDetailsGetAction.selectedTab === enums.MessageFolderType.None) {
                        _this._messageViewAction = enums.MessageViewAction.View;
                    }
                    var messageRecieved_1 = messagesDetailsGetAction.messageDetails;
                    // if message already exist, update it. Else push
                    var itemExist = _this._messageDetails.some(function (messageDetails) {
                        return messageDetails.examinerMessageId === messageRecieved_1.examinerMessageId;
                    });
                    if (itemExist) {
                        _this._messageDetails.forEach(function (messageDetails) {
                            if (messageDetails.examinerMessageId === messageRecieved_1.examinerMessageId) {
                                messageDetails.hasPermissionToDisplayId = messageRecieved_1.hasPermissionToDisplayId;
                                messageDetails.markingModeId = messageRecieved_1.markingModeId;
                                messageDetails.displayId = messageRecieved_1.displayId;
                            }
                        });
                    }
                    else {
                        _this._messageDetails.push(messagesDetailsGetAction.messageDetails);
                    }
                    _this.emit(MessageStore.MESSAGE_DETAILS_RECEIVED, messagesDetailsGetAction.messageDetails.examinerMessageId);
                    break;
                case ActionType.MESSAGE_STATUS_UPDATE_ACTION:
                    var messageStatusUpdateAction_1 = action;
                    if (messageStatusUpdateAction_1.messageStatus === enums.MessageReadStatus.Closed) {
                        _this._isMessageDataRequireUpdation = true;
                        _this.emit(MessageStore.MESSAGE_DELETE_EVENT);
                        _this.newlyDeletedMessageIds.push(messageStatusUpdateAction_1.messagId);
                    }
                    _this.newlyReadMessageIds.push(messageStatusUpdateAction_1.messagId);
                    _this._unreadMessageCount--;
                    break;
                case ActionType.GET_UNREAD_MANDATORY_MESSAGE_STATUS:
                    var unreadMandatoryMessageStatusAction = action;
                    _this._isUnreadMandatoryMessagePresent = unreadMandatoryMessageStatusAction.isUnreadMandatoryMessagePresent;
                    _this.emit(MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED, _this.isUnreadMandatoryMessagePresent, unreadMandatoryMessageStatusAction.triggerPoint);
                    break;
                case ActionType.REFRESH_MESSAGE_FOLDER:
                    var refreshMessageTabAction = action;
                    _this._messageFolderRefreshed = true;
                    if (!refreshMessageTabAction.useCache) {
                        _this._isMessageDataRequireUpdation = true;
                    }
                    _this.emit(MessageStore.REFRESH_MESSAGE_TAB, enums.MessageFolderType.Inbox);
                    break;
                case ActionType.MESSAGE_NAVIGATE_ACTION:
                    var messageNavigationAction = action;
                    _this.emit(MessageStore.MESSAGE_NAVIGATION_EVENT, messageNavigationAction.messageNavigationArguments);
                    break;
                case ActionType.OPEN_RESPONSE:
                    var openAction = action;
                    _this._responseOpenTriggerPoint = openAction.triggerPoint;
                    //reset message collection when open Response #57273
                    _this._messages = undefined;
                    break;
                case ActionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    _this._searchedResponseData = responseDataGetAction_1.searchedResponseData;
                    _this._isMessageDataRequireUpdation =
                        (_this._searchedResponseData.approvalStatusId === enums.ExaminerApproval.Withdrawn ||
                            _this._isSupervisorRemarkRequestCreated);
                    if (_this._searchedResponseData.questionPaperId === 0) {
                        _this.emit(MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT);
                    }
                    else {
                        _this.emit(MessageStore.RESPONSE_DATA_RECEIVED_EVENT, responseDataGetAction_1.searchedResponseData);
                    }
                    break;
                case ActionType.GET_TEAM_ACTION:
                    var teamDetailsAction = action;
                    _this._teamList = teamDetailsAction.team;
                    teamListPopupHelper.getTreeViewTeamList(_this._teamList, teamDetailsAction.examinerRoleId);
                    _this._updatedTeamList = JSON.parse(JSON.stringify(_this._teamList));
                    _this.emit(MessageStore.TEAM_LIST_RECEIVED);
                    break;
                case ActionType.UPDATE_TEAM_LIST_ACTION:
                    var _updateTeamListAction = action;
                    _this._updatedTeamList = teamListPopupHelper.updateTeamList(_this._updatedTeamList, _updateTeamListAction.examinerRoleId, _updateTeamListAction.isExpand);
                    _this.emit(MessageStore.TEAM_LIST_UPDATED, false, _updateTeamListAction.isExpand);
                    break;
                case ActionType.ENTIRE_TEAM_LIST_CHECKED_ACTION:
                    var entireTeamChecked = action;
                    _this._updatedTeamList = teamListPopupHelper.selectEntireTeam(_this._updatedTeamList, entireTeamChecked.isChecked);
                    _this.emit(MessageStore.TEAM_LIST_UPDATED, true);
                    break;
                case ActionType.UPDATE_SELECTED_TEAM_LIST_ACTION:
                    var updateSelectedList = action;
                    if (updateSelectedList.isSaved) {
                        _this._teamList = JSON.parse(JSON.stringify(_this._updatedTeamList));
                    }
                    else {
                        _this._updatedTeamList = JSON.parse(JSON.stringify(_this._teamList));
                    }
                    _this.emit(MessageStore.UPDATE_TEAM_LIST_RECEIVED, updateSelectedList.isSaved);
                    break;
                case ActionType.CLEAR_TEAM_LIST_SELECTION_ACTION:
                    teamListPopupHelper.getTreeViewTeamList(_this._teamList, action.examinerRoleId);
                    break;
                case ActionType.MANDATORY_MESSAGE_VALIDATION_POPUP_ACTION:
                    _this.emit(MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT);
                    break;
                case ActionType.UPDATE_MESSAGE_PRIORITY_ACTION:
                    _this.emit(MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT);
                    break;
                case ActionType.CALCULATE_RECIPIENT_COUNT_ACTION:
                    _this.emit(MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT);
                    break;
                case ActionType.CREATE_EXAMINER_ROLE_FOR_ADMIN_REMARKER:
                    _this._newExaminerRolecreatedForAdminRemarker = true;
                    break;
                case ActionType.MESSAGE_PANEL_CLICKED_ACTION:
                    _this._isMessageSidePanelClicked = action.isMessageSidePanelOpen;
                    break;
                case ActionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    _this._isSupervisorRemarkRequestCreated = true;
                    break;
            }
        });
    }
    Object.defineProperty(MessageStore.prototype, "searchResponseData", {
        /*
         * returns the searched response data
         */
        get: function () {
            return this._searchedResponseData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "getNotificationData", {
        /*
         * returns the notification data
         */
        get: function () {
            return this.notificationData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "getUnreadMessageCount", {
        /*
         * returns the unread message count
         */
        get: function () {
            return this._unreadMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "getExceptionMessageCount", {
        /*
        * returns the exception message count
        */
        get: function () {
            return this.notificationData !== undefined ? this.notificationData.getExceptionMessageCount : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "messageViewAction", {
        /**
         * returns the current message view action
         */
        get: function () {
            return this._messageViewAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isMessagePanelActive", {
        /**
         * returns true if message panel is open, minimized or maximized
         */
        get: function () {
            return this.messageViewAction === enums.MessageViewAction.Open || this.messageViewAction === enums.MessageViewAction.Minimize ||
                this.messageViewAction === enums.MessageViewAction.Maximize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isMessagePanelVisible", {
        /**
         * returns true if message panel is open or maximized
         */
        get: function () {
            return this.messageViewAction === enums.MessageViewAction.Open || this.messageViewAction === enums.MessageViewAction.View ||
                this.messageViewAction === enums.MessageViewAction.Maximize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "messages", {
        /**
         * Get the messages
         */
        get: function () {
            return this._messages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "messagesMarkSchemes", {
        /**
         * Get the messages mark schemes
         */
        get: function () {
            return this._messageMarkSchemes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isMessageDataRequireUpdation", {
        /**
         * returns true if message is sent- flag used to determine whether to reload sent messages from the db
         */
        get: function () {
            return this._isMessageDataRequireUpdation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isNewExaminerRoleCreated", {
        /**
         * returns true if new examiner role is created for the admin remarker-
         * flag used to determine whether to reload sent messages from the db
         */
        get: function () {
            return this._newExaminerRolecreatedForAdminRemarker;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the message details based on the message
     * @param msgId
     */
    MessageStore.prototype.getMessageDetails = function (msgId) {
        for (var arrayIndex = 0; arrayIndex < this._messageDetails.length; arrayIndex++) {
            if (this._messageDetails[arrayIndex]) {
                if (this._messageDetails[arrayIndex].examinerMessageId === msgId) {
                    return this._messageDetails[arrayIndex];
                }
            }
        }
        return null;
    };
    /**
     * Get the message data based on the message id
     * @param msgId
     */
    MessageStore.prototype.getMessageData = function (msgId) {
        return this._messages.filter(function (message) { return message.examinerMessageId === msgId; }).first();
    };
    /**
     * Check the message is read or not
     * @param msgId
     */
    MessageStore.prototype.isMessageRead = function (msgId) {
        return this.newlyReadMessageIds.indexOf(msgId) >= 0;
    };
    /**
     * Check any message has been deleted
     */
    MessageStore.prototype.isMessageDeleted = function () {
        return this.newlyDeletedMessageIds.length !== 0;
    };
    Object.defineProperty(MessageStore.prototype, "navigateFrom", {
        /**
         * Getting where to the navigation happening
         */
        get: function () {
            return this._navigatingFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "previousMessageViewAction", {
        /**
         * Return the previous message view action
         */
        get: function () {
            return this._previousMessageViewAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isUnreadMandatoryMessagePresent", {
        /**
         * Returns true if unread mandatory messages are available else return false
         */
        get: function () {
            return this._isUnreadMandatoryMessagePresent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "selectedMandatoryMessageId", {
        /**
         * return the most recent unread mandatory messageId
         */
        get: function () {
            var _this = this;
            var selectedMandatoryMessageId = 0;
            if (this.messages && this.messages.count() > 0) {
                var message = this.messages.filter(function (x) { return x.status === enums.MessageReadStatus.New &&
                    x.priorityName.toLowerCase() === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory).toLowerCase()
                    && x.messageFolderType === enums.MessageFolderType.Inbox
                    && !_this.isMessageRead(x.examinerMessageId); }).first();
                if (message) {
                    selectedMandatoryMessageId = message.examinerMessageId;
                }
            }
            return selectedMandatoryMessageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "hasUnReadMandatoryMessages", {
        /**
         * Check whether unread mandatory messages are available or not
         */
        get: function () {
            var _this = this;
            if (this.messages && this.messages.count() > 0) {
                return this.messages.filter(function (x) { return x.status === enums.MessageReadStatus.New &&
                    x.priorityName.toLowerCase() === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory).toLowerCase()
                    && x.messageFolderType === enums.MessageFolderType.Inbox
                    && !_this.isMessageRead(x.examinerMessageId); }).count() > 0;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "selectedResponseMessageId", {
        /**
         * return the most recent unread response messageId
         */
        get: function () {
            var _this = this;
            var selectedMandatoryMessageId = 0;
            if (this.messages && this.messages.count() > 0) {
                var message = this.messages.filter(function (x) { return x.status === enums.MessageReadStatus.New
                    && !_this.isMessageRead(x.examinerMessageId); }).first();
                // if unread messages are available then set the recent unread messageId else take the first one
                selectedMandatoryMessageId = message ? message.examinerMessageId : this.messages.first().examinerMessageId;
            }
            return selectedMandatoryMessageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "responseOpenTriggerPoint", {
        /**
         * Returns the open response trigger point
         */
        get: function () {
            return this._responseOpenTriggerPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "teamDetails", {
        /**
         * Returns the team list details.
         */
        get: function () {
            return this._updatedTeamList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isMessageSidePanelOpen", {
        /**
         * Get LHS messgae panel open status
         */
        get: function () {
            return this._isMessageSidePanelClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStore.prototype, "isMessagePanelOpened", {
        /**
         * Get message panel open status
         */
        get: function () {
            return this._messageOpened;
        },
        enumerable: true,
        configurable: true
    });
    MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT = 'updatenotificationevent';
    MessageStore.SEND_MESSAGE_SUCCESS_EVENT = 'sendmessagesuccessevent';
    MessageStore.SEND_MESSAGE_ERROR_EVENT = 'sendmessageerrorevent';
    MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT = 'calculaterecipientcountevent';
    // messaging section opened event
    MessageStore.MESSAGE_OPEN_EVENT = 'messageopenevent';
    // messaging section closed event
    MessageStore.MESSAGE_CLOSE_EVENT = 'messagecloseevent';
    // messaging section navigate away event
    MessageStore.MESSAGE_NAVIGATE_EVENT = 'messagenavigateevent';
    // popup displaying event
    MessageStore.POPUP_DISPLAY_EVENT = 'popupdisplayevent';
    // messaging section minimized event
    MessageStore.MESSAGE_MINIMIZE_EVENT = 'messageminimizeevent';
    // messaging section maximized event
    MessageStore.MESSAGE_MAXIMIZE_EVENT = 'messagemaximizeevent';
    // Message data received event
    MessageStore.MESSAGE_RECEIVED = 'MessagesReceived';
    // Message Details data received event
    MessageStore.MESSAGE_DETAILS_RECEIVED = 'MessagesDetailsReceived';
    // If message details has been failed
    MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED = 'MessagesDetailsReceivedFailed';
    // Message data received event for the response
    MessageStore.RESPONSE_MESSAGE = 'ResponseMessagesReceived';
    // unread mandatory message status event
    MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED = 'UnreadMandatoryMessageStatusUpdated';
    // refresh inbox upon unread mandatory message received
    MessageStore.REFRESH_MESSAGE_TAB = 'RefreshMessageTab';
    //Event when navigated away from message
    MessageStore.MESSAGE_NAVIGATION_EVENT = 'MessageNavigationEvent';
    // Message deleted event
    MessageStore.MESSAGE_DELETE_EVENT = 'messagedeletedevent';
    // Message deleted event
    MessageStore.MESSAGE_DELETE_CLICK_EVENT = 'messagedeleteclickevent';
    /* Response Data Received Event*/
    MessageStore.RESPONSE_DATA_RECEIVED_EVENT = 'ResponseDataReceivedEvent';
    /* To address details received event */
    MessageStore.TEAM_LIST_RECEIVED = 'TeamListReceived';
    /* team list updated event */
    MessageStore.TEAM_LIST_UPDATED = 'TeamListUpdated';
    /* Update address list received event */
    MessageStore.UPDATE_TEAM_LIST_RECEIVED = 'UpdateTeamListReceived';
    /* Mandatory message validation popup event */
    MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT = 'MandatoryMessageValidationPopupEvent';
    /* Update message priority event */
    MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT = 'UpdateMessagePriorityEvent';
    MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT = 'ResponseDataReceivedFailedEvent';
    return MessageStore;
}(storeBase));
var instance = new MessageStore();
module.exports = { MessageStore: MessageStore, instance: instance };
//# sourceMappingURL=messagestore.js.map