import refreshMessageFolderAction = require('./refreshmessagefolderaction');
import messageViewAction = require('./messageviewaction');
import dispatcher = require('../../app/dispatcher');
import messagingDataService = require('../../dataservices/messaging/messagingdataservice');
import sendMessageArgument = require('../../dataservices/messaging/sendmessageargument');
import sendMessageAction = require('./sendmessageaction');
import promise = require('es6-promise');
import enums = require('../../components/utility/enums');
import MessageAction = require('./messageaction');
import loadMessageArguments = require('../../dataservices/messaging/loadmessagesarguments');
import messageBodyDetailsGetAction = require('./messagebodydetailsgetaction');
import messageStatusUpdateAction = require('./messagestatusupdateaction');
import messageArgument = require('../../dataservices/messaging/messageargument');
import messageNavigateAction = require('./messagenavigateaction');
import getUnreadMandatoryMessageStatusAction = require('./getunreadmandatorymessagestatusaction');
import base = require('../base/actioncreatorbase');
import teamArgument = require('../../dataservices/messaging/teamargument');
import getTeamAction = require('./getteamaction');
import teamReturn = require('../../stores/message/typings/teamreturn');
import updateTeamListAction = require('./updateteamlistaction');
import entireTeamListChecked = require('./entireteamlistcheckedaction');
import updateSelectedTeamList = require('./updateselectedteamlistaction');
import clearTeamListSelectionAction = require('./clearteamlistselectionaction');
import mandatoryMessageValidationPopupAction = require('./mandatorymessagevalidationpopupaction');
import updateMessagePriorityAction = require('./updatemessagepriorityaction');
import calculateRecipientCountAction = require('./calculaterecipientcountaction');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import constants = require('../../components/utility/constants');
import messagePanelClickedAction = require('./messagepanelclickedaction');

class MessagingActionCreator extends base {

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
    public sendExaminerMessage(examinerList: Array<number>,
        body: string,
        subject: string,
        questionPaperId: number,
        displayId: number,
        priorityId: number,
        markSchemeGroupId: number,
        candidateScriptId: number,
        markGroupId: number,
        esMarkGroupId: number,
        toTeam: boolean,
        examinerRoleId?: number,
        examBodyMessageType?: number): void {

        let that = this;
        let isMarksChecked: boolean = false;

        let arg = new sendMessageArgument(examinerList,
            body,
            subject,
            questionPaperId,
            displayId,
            priorityId,
            markSchemeGroupId,
            candidateScriptId,
            markGroupId,
            toTeam,
            esMarkGroupId,
            markerOperationModeFactory.operationMode.isTeamManagementMode,
            examBodyMessageType);

        let warningMessageAction: enums.WarningMessageAction;
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

        messagingDataService.sendExaminerMessage(arg, isMarksChecked, function (success: boolean, json: SendMessageReturnDetails) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json, false, true, warningMessageAction)) {
                dispatcher.dispatch(
                    new sendMessageAction(success, examinerRoleId, priorityId, examBodyMessageType, json.failureCode,
                        isMarksChecked, json.messageSendErrorCode));
            }
        });
    }

    /**
     * Opens or close messaging section
     * @param messageAction - Close or Open
     */
    public messageAction(action: enums.MessageViewAction, messageType: enums.MessageType = enums.MessageType.None,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none,
        navigateFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new messageViewAction(true, action, messageType, navigateTo, navigateFrom));
        }).catch();
    }

    /**
     * Get the Messages
     * @param arg
     * @param checkUnreadMandatoryMessage
     */
    public getMessages(arg: loadMessageArguments, checkUnreadMandatoryMessage: boolean = true): void {

        let that = this;

        messagingDataService.getExaminerMessage(
            arg,
            function (success: boolean, getMessagesReturn: GetMessagesReturn, isResultFromCache: boolean) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(getMessagesReturn, false, true)) {

                    if (!success) {
                        getMessagesReturn = undefined;
                    }
                    dispatcher.dispatch(
                        new MessageAction(success, getMessagesReturn, arg.messageFolderType, arg.candidateResponseId, isResultFromCache,
                            checkUnreadMandatoryMessage, arg.hiddenQigList));
                }
            });
    }

    /**
     * Update the message read status
     * @param msgId
     * @param readStatus
     */
    public updateMessageStatus(arg: messageArgument) {

        let that = this;
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            messagingDataService.updateMessageStatus(arg, function (success: boolean, json: any) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true)) {

                    if (!success) {
                        json = undefined;
                    }
                    dispatcher.dispatch(
                        new messageStatusUpdateAction(true, arg.messageId, arg.messageDistributionIds, arg.examinerMessageStatusId));
                }
            });
        }).catch();
    }

    /**
     * Get the Message Details.
     * @param msgId
     */
    public getMessageBodyDetails(msgId: number, selectedTab: enums.MessageFolderType) {

		let that = this;
		messagingDataService.getMessageBodyDetails(msgId, markerOperationModeFactory.operationMode.isStandardisationSetupMode,
			function (success: boolean, messgeDetails: MessageDetails) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
			if (that.validateCall(messgeDetails, false, true)) {

				if (!success) {
					messgeDetails = undefined;
				}
			} else {
				success = false;
			}
			dispatcher.dispatch(new messageBodyDetailsGetAction(success, msgId, messgeDetails, selectedTab));
        });
    }

    /**
     * Get the Message Details.
     */
    public getUnreadMandatoryMessageStatus(triggerPoint: enums.TriggerPoint) {
        messagingDataService.getUnreadMandatoryMessageStatus(function (success: boolean, isUnreadMandatoryMessagePresent: boolean) {
            dispatcher.dispatch(new getUnreadMandatoryMessageStatusAction(true, isUnreadMandatoryMessagePresent, triggerPoint));
        });
    }

    /**
     * display mandatory validation popup.
     */
    public displayMandatoryValidationPopup(isDisplay: boolean = false) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new mandatoryMessageValidationPopupAction(isDisplay));
        }).catch();
    }

    /**
     * update message priority
     */
    public updateMessagePriority(isDisplay: boolean = false) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMessagePriorityAction());
        }).catch();
    }
    /**
     * Refresh message folder
     * @param messageFolder - message folder for refreshing
     */
    public refreshMessageFolder(messageFolder: enums.MessageFolderType) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new refreshMessageFolderAction(true, messageFolder));
        }).catch();
    }

    /**
     * Get the Navigation Arguments.
     * @param messageNavigationArguments
     */
    public canMessageNavigate(messageNavigationArguments: MessageNavigationArguments) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new messageNavigateAction(messageNavigationArguments));
        }).catch();
    }

    /**
     * Get team details.
     * @param arg
     */
    public getTeamDetails(args: teamArgument) {
        let that = this;
        messagingDataService.getTeamDetails(args, function (success: boolean, teamDetails: teamReturn) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(teamDetails, false, true)) {

                if (!success) {
                    teamDetails = undefined;
                }
                dispatcher.dispatch(new getTeamAction(true, teamDetails, args.examinerRoleId));
            }
        });
    }

    /**
     * update team details.
     */
    public updateTeamListStatus(examinerRoleId: number, isExpand: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateTeamListAction(examinerRoleId, isExpand));
        }).catch();
    }

    /**
     * Method to check whether the entire team selected or not.
     * @param isChecked
     */
    public entireTeamChecked(isChecked: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new entireTeamListChecked(isChecked));
        }).catch();
    }

    /**
     * Method to update the selected team list.
     * @param isSaved
     */
    public updateSelectedTeamList(isSaved: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateSelectedTeamList(isSaved));
        }).catch();
    }

    /**
     * Clear team selection.
     */
    public clearTeamSelection(examinerRoleId: number) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new clearTeamListSelectionAction(examinerRoleId));
        }).catch();
    }

   /**
    * Calculate Recipient Count.
    */
    public calculateRecipientCount() {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new calculateRecipientCountAction());
        }).catch();
    }

    /**
     * returns LHS message panel status
     * @param panelOpen
     */
    public isMessageSidePanelOpen(panelOpen: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new messagePanelClickedAction(panelOpen));
        }).catch();
    }
}

let messagingActionCreator = new MessagingActionCreator();
export = messagingActionCreator;