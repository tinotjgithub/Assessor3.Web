"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var refreshMessageFolderAction = require('./refreshmessagefolderaction');
var messageViewAction = require('./messageviewaction');
var dispatcher = require('../../app/dispatcher');
var messagingDataService = require('../../dataservices/messaging/messagingdataservice');
var sendMessageArgument = require('../../dataservices/messaging/sendmessageargument');
var sendMessageAction = require('./sendmessageaction');
var promise = require('es6-promise');
var enums = require('../../components/utility/enums');
var MessageAction = require('./messageaction');
var messageBodyDetailsGetAction = require('./messagebodydetailsgetaction');
var messageStatusUpdateAction = require('./messagestatusupdateaction');
var messageNavigateAction = require('./messagenavigateaction');
var getUnreadMandatoryMessageStatusAction = require('./getunreadmandatorymessagestatusaction');
var base = require('../base/actioncreatorbase');
var getTeamAction = require('./getteamaction');
var updateTeamListAction = require('./updateteamlistaction');
var entireTeamListChecked = require('./entireteamlistcheckedaction');
var updateSelectedTeamList = require('./updateselectedteamlistaction');
var clearTeamListSelectionAction = require('./clearteamlistselectionaction');
var mandatoryMessageValidationPopupAction = require('./mandatorymessagevalidationpopupaction');
var updateMessagePriorityAction = require('./updatemessagepriorityaction');
var calculateRecipientCountAction = require('./calculaterecipientcountaction');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var constants = require('../../components/utility/constants');
var messagePanelClickedAction = require('./messagepanelclickedaction');
var MessagingActionCreator = (function (_super) {
    __extends(MessagingActionCreator, _super);
    function MessagingActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Send the message.
     * @param examinerList
     * @param fromExaminerId
     * @param body
     * @param subject
     * @param questionPaperId
     * @param displayId
     * @param priorityId
     */
    MessagingActionCreator.prototype.sendExaminerMessage = function (examinerList, body, subject, questionPaperId, displayId, priorityId, markSchemeGroupId, candidateScriptId, markGroupId, esMarkGroupId, toTeam, examinerRoleId, examBodyMessageType) {
        var that = this;
        var isMarksChecked = false;
        var arg = new sendMessageArgument(examinerList, body, subject, questionPaperId, displayId, priorityId, markSchemeGroupId, candidateScriptId, markGroupId, toTeam, esMarkGroupId, markerOperationModeFactory.operationMode.isTeamManagementMode, examBodyMessageType);
        var warningMessageAction;
        warningMessageAction = enums.WarningMessageAction.None;
        if (priorityId === constants.SYSTEM_MESSAGE) {
            if (examBodyMessageType) {
                if (examBodyMessageType === enums.SystemMessage.MarksChecked) {
                    warningMessageAction = enums.WarningMessageAction.MarksChecked;
                    isMarksChecked = true;
                }
                if (examBodyMessageType === enums.SystemMessage.CheckMyMarks) {
                    warningMessageAction = enums.WarningMessageAction.CheckMyMarks;
                }
            }
        }
        messagingDataService.sendExaminerMessage(arg, isMarksChecked, function (success, json) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json, false, true, warningMessageAction)) {
                dispatcher.dispatch(new sendMessageAction(success, examinerRoleId, priorityId, examBodyMessageType, json.failureCode, isMarksChecked, json.messageSendErrorCode));
            }
        });
    };
    /**
     * Opens or close messaging section
     * @param messageAction - Close or Open
     */
    MessagingActionCreator.prototype.messageAction = function (action, messageType, navigateTo, navigateFrom) {
        if (messageType === void 0) { messageType = enums.MessageType.None; }
        if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
        if (navigateFrom === void 0) { navigateFrom = enums.SaveAndNavigate.none; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new messageViewAction(true, action, messageType, navigateTo, navigateFrom));
        }).catch();
    };
    /**
     * Get the Messages
     * @param arg
     * @param checkUnreadMandatoryMessage
     */
    MessagingActionCreator.prototype.getMessages = function (arg, checkUnreadMandatoryMessage) {
        if (checkUnreadMandatoryMessage === void 0) { checkUnreadMandatoryMessage = true; }
        var that = this;
        messagingDataService.getExaminerMessage(arg, function (success, getMessagesReturn, isResultFromCache) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(getMessagesReturn, false, true)) {
                if (!success) {
                    getMessagesReturn = undefined;
                }
                dispatcher.dispatch(new MessageAction(success, getMessagesReturn, arg.messageFolderType, arg.candidateResponseId, isResultFromCache, checkUnreadMandatoryMessage));
            }
        });
    };
    /**
     * Update the message read status
     * @param msgId
     * @param readStatus
     */
    MessagingActionCreator.prototype.updateMessageStatus = function (arg) {
        var that = this;
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            messagingDataService.updateMessageStatus(arg, function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true)) {
                    if (!success) {
                        json = undefined;
                    }
                    dispatcher.dispatch(new messageStatusUpdateAction(true, arg.messageId, arg.messageDistributionIds, arg.examinerMessageStatusId));
                }
            });
        }).catch();
    };
    /**
     * Get the Message Details.
     * @param msgId
     */
    MessagingActionCreator.prototype.getMessageBodyDetails = function (msgId, selectedTab) {
        var that = this;
        messagingDataService.getMessageBodyDetails(msgId, markerOperationModeFactory.operationMode.isStandardisationSetupMode, function (success, messgeDetails) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(messgeDetails, false, true)) {
                if (!success) {
                    messgeDetails = undefined;
                }
            }
            else {
                success = false;
            }
            dispatcher.dispatch(new messageBodyDetailsGetAction(success, msgId, messgeDetails, selectedTab));
        });
    };
    /**
     * Get the Message Details.
     */
    MessagingActionCreator.prototype.getUnreadMandatoryMessageStatus = function (triggerPoint) {
        messagingDataService.getUnreadMandatoryMessageStatus(function (success, isUnreadMandatoryMessagePresent) {
            dispatcher.dispatch(new getUnreadMandatoryMessageStatusAction(true, isUnreadMandatoryMessagePresent, triggerPoint));
        });
    };
    /**
     * display mandatory validation popup.
     */
    MessagingActionCreator.prototype.displayMandatoryValidationPopup = function (isDisplay) {
        if (isDisplay === void 0) { isDisplay = false; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new mandatoryMessageValidationPopupAction(isDisplay));
        }).catch();
    };
    /**
     * update message priority
     */
    MessagingActionCreator.prototype.updateMessagePriority = function (isDisplay) {
        if (isDisplay === void 0) { isDisplay = false; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMessagePriorityAction());
        }).catch();
    };
    /**
     * Refresh message folder
     * @param messageFolder - message folder for refreshing
     */
    MessagingActionCreator.prototype.refreshMessageFolder = function (messageFolder) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new refreshMessageFolderAction(true, messageFolder));
        }).catch();
    };
    /**
     * Get the Navigation Arguments.
     * @param messageNavigationArguments
     */
    MessagingActionCreator.prototype.canMessageNavigate = function (messageNavigationArguments) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new messageNavigateAction(messageNavigationArguments));
        }).catch();
    };
    /**
     * Get team details.
     * @param arg
     */
    MessagingActionCreator.prototype.getTeamDetails = function (args) {
        var that = this;
        messagingDataService.getTeamDetails(args, function (success, teamDetails) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(teamDetails, false, true)) {
                if (!success) {
                    teamDetails = undefined;
                }
                dispatcher.dispatch(new getTeamAction(true, teamDetails, args.examinerRoleId));
            }
        });
    };
    /**
     * update team details.
     */
    MessagingActionCreator.prototype.updateTeamListStatus = function (examinerRoleId, isExpand) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateTeamListAction(examinerRoleId, isExpand));
        }).catch();
    };
    /**
     * Method to check whether the entire team selected or not.
     * @param isChecked
     */
    MessagingActionCreator.prototype.entireTeamChecked = function (isChecked) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new entireTeamListChecked(isChecked));
        }).catch();
    };
    /**
     * Method to update the selected team list.
     * @param isSaved
     */
    MessagingActionCreator.prototype.updateSelectedTeamList = function (isSaved) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateSelectedTeamList(isSaved));
        }).catch();
    };
    /**
     * Clear team selection.
     */
    MessagingActionCreator.prototype.clearTeamSelection = function (examinerRoleId) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new clearTeamListSelectionAction(examinerRoleId));
        }).catch();
    };
    /**
     * Calculate Recipient Count.
     */
    MessagingActionCreator.prototype.calculateRecipientCount = function () {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new calculateRecipientCountAction());
        }).catch();
    };
    /**
     * returns LHS message panel status
     * @param panelOpen
     */
    MessagingActionCreator.prototype.isMessageSidePanelOpen = function (panelOpen) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new messagePanelClickedAction(panelOpen));
        }).catch();
    };
    return MessagingActionCreator;
}(base));
var messagingActionCreator = new MessagingActionCreator();
module.exports = messagingActionCreator;
//# sourceMappingURL=messagingactioncreator.js.map