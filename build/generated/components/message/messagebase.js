"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var popupHelper = require('../utility/popup/popuphelper');
var popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var messageStore = require('../../stores/message/messagestore');
var worklistStore = require('../../stores/worklist/workliststore');
var qualityfeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
var messageHelper = require('../utility/message/messagehelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var Immutable = require('immutable');
var MessageBase = (function (_super) {
    __extends(MessageBase, _super);
    /**
     * @constructor
     */
    function MessageBase(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isSelectedItemClicked = false;
        this.navigateTo = enums.SaveAndNavigate.none;
        this.msgEditorId = 'msg-tinymce-editor';
        this._boundHandleOnClick = null;
        this.isSubordinateSelected = false;
        this.sendMessageActionInProgress = false;
        this.messageType = enums.MessageType.None;
        /**
         * Callback function for dropdown select
         */
        this.onSelect = function (selectedItem, event) {
            _this.priorityDropDownSelectedItem = selectedItem;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         *  Callback function for dropdown click
         */
        this.onDropDownClick = function (dropDown) {
            _this.clickedDropDown = dropDown;
            _this.isSelectedItemClicked = true;
            if (_this.clickedDropDown === enums.DropDownType.Priority) {
                _this.isQigDropDownOpen = undefined;
                _this.isDropDownOpen = _this.isDropDownOpen === undefined ? true : !_this.isDropDownOpen;
            }
            else if (_this.clickedDropDown === enums.DropDownType.QIG) {
                _this.isDropDownOpen = undefined;
                _this.isQigDropDownOpen = _this.isQigDropDownOpen === undefined ? true : !_this.isQigDropDownOpen;
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Handle click events on the window and collapse priority selection dropdown
         * @param {any} source - The source element
         */
        this.handleOnClick = function () {
            if (!_this.isSelectedItemClicked && ((_this.isDropDownOpen !== undefined && _this.isDropDownOpen)
                || (_this.isQigDropDownOpen !== undefined && _this.isQigDropDownOpen))) {
                // collapse the priority dropdown
                _this.isDropDownOpen = false;
                _this.isQigDropDownOpen = false;
                _this.setState({ renderedOn: Date.now() });
            }
            else {
                _this.isSelectedItemClicked = false;
            }
        };
        /**
         *  This will return the localised string for message priority dropdown
         */
        this.getPriorityDropDownItem = function (dropDownItem) {
            var localisedDropDownItem;
            switch (dropDownItem) {
                case enums.MessagePriority.Important:
                    localisedDropDownItem = localeStore.instance.TranslateText('messaging.compose-message.priority.important');
                    break;
                case enums.MessagePriority.Mandatory:
                    localisedDropDownItem = localeStore.instance.TranslateText('messaging.compose-message.priority.mandatory');
                    break;
                default:
                    localisedDropDownItem = localeStore.instance.TranslateText('messaging.compose-message.priority.standard');
                    break;
            }
            return localisedDropDownItem;
        };
        /**
         * Method fired when the message is closed.
         */
        this.onMessageClose = function () {
            // Show discard message if content edited; or just close the panel.
            if (_this.isMessagePanelEdited) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
                if (_this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick
                    || _this.navigateTo === enums.SaveAndNavigate.toReplyMessage
                    || _this.navigateTo === enums.SaveAndNavigate.toForwardMessage) {
                    popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardOnNewMessageButtonClick, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                        popupContent: localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.body-start-new-message-while-composing')
                    });
                }
                else if (_this.navigateTo === enums.SaveAndNavigate.toNewResponseMessageCompose) {
                    popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardOnNewMessageButtonClick, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                        popupContent: localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body')
                    });
                }
                else {
                    var messageType = _this.navigateTo !== enums.SaveAndNavigate.none
                        ? enums.PopUpType.DiscardMessageNavigateAway : enums.PopUpType.DiscardMessage;
                    popUpDisplayActionCreator.popUpDisplay(messageType, enums.PopUpActionType.Show, messageStore.instance.navigateFrom, {
                        popupContent: (_this.navigateTo === enums.SaveAndNavigate.messageWithInResponse ?
                            localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body') : undefined)
                    });
                }
            }
            else if (_this.navigateTo !== enums.SaveAndNavigate.none && _this.navigateTo !== enums.SaveAndNavigate.messageWithInResponse
                && _this.navigateTo !== enums.SaveAndNavigate.newMessageButtonClick) {
                // hide the message panel and navigate away
                _this.onDiscardMessageConfirmed();
            }
            else if (_this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick) {
                _this.navigateTo = enums.SaveAndNavigate.none;
                _this.isMessagePopupMinimized = false;
                _this.setState({ renderedOn: Date.now() });
            }
            else {
                // Close the Message Panel.
                _this.resetAndCloseMessagePanel();
                _this.navigateTo = enums.SaveAndNavigate.none;
            }
        };
        /**
         * Navigate away from current response.
         */
        this.onNavigateAwayFromResponse = function (navigateTo) {
            _this.navigateTo = navigateTo;
            _this.onMessageClose();
        };
        /**
         * Reset message panel and close
         */
        this.resetAndCloseMessagePanel = function () {
            _this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
            _this.toFieldValues = null;
            _this.toFieldIds = null;
            _this.messageSubject = '';
            _this.messageBody = '';
            _this.isDropDownOpen = undefined;
            _this.isQigDropDownOpen = undefined;
            _this.props.closeMessagePanel(_this.navigateTo);
            _this.selectedQigItemId = undefined;
            _this.questionPaperPartId = undefined;
            messageHelper.handleSubjectChange(_this.messageSubject);
            _this.sendMessageActionInProgress = false;
            // updating message component with default values
            // this enable or Disable send button will call setState
            _this.enableDisableSendButton();
            // Need to Update the UI (Subject box in the message, after closing the message : Bug 28224
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Method fired when discard message is confirmed.
         */
        this.onDiscardMessageConfirmed = function (actionFromCombinedPopup, navigateTo) {
            if (actionFromCombinedPopup === void 0) { actionFromCombinedPopup = false; }
            if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
            // If message panel is not edited, no need to change the UI while logout
            if (_this.isMessagePanelEdited) {
                // Close the Message Panel.
                _this.resetAndCloseMessagePanel();
            }
            else if (!_this.isMessagePanelEdited && _this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Open);
            }
            else {
                _this.resetAndCloseMessagePanel();
            }
            // on message close navigate away from response scenario
            if (_this.navigateTo !== enums.SaveAndNavigate.none && _this.navigateTo !== enums.SaveAndNavigate.messageWithInResponse
                && _this.navigateTo !== enums.SaveAndNavigate.toNewResponseMessageCompose &&
                !(_this.navigateTo === enums.SaveAndNavigate.toResponse && qualityfeedbackHelper.isResponseNavigationBlocked())) {
                if (_this.navigateTo === enums.SaveAndNavigate.toSupervisorRemark) {
                    // Response Going from readonly mode to marking. Reset the message related values from response screen.
                    _this.resetAndCloseMessagePanel();
                }
                // if navigate away from Resposne then close the response and move to worklist.
                popupHelper.navigateAway(_this.navigateTo);
            }
            else if (actionFromCombinedPopup) {
                popupHelper.navigateAway(navigateTo);
            }
            _this.navigateTo = enums.SaveAndNavigate.none;
        };
        /**
         * Method fired when discard message is cancelled.
         */
        this.onDiscardMessageCancelled = function () {
            // reset navigate away from response
            _this.navigateTo = enums.SaveAndNavigate.none;
            messageHelper.handleSubjectChange(_this.messageSubject);
        };
        /**
         * Handles changes in the message panel subject section.
         * @param e
         */
        this.handleSubjectChange = function (subject) {
            _this.messageSubject = subject;
            _this.enableDisableSendButton();
            messageHelper.handleSubjectChange(subject);
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Enable and disable send button on tinyMCE editor change.
         */
        this.toggleSaveButtonState = function () {
            _this.enableDisableSendButton();
        };
        /**
         * Method fired when the message panel is minimized.
         */
        this.onMinimize = function () {
            messagingActionCreator.messageAction(enums.MessageViewAction.Minimize);
        };
        /**
         * Method fired when the message panel is maximized.
         */
        this.onMaximize = function () {
            messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
        };
        /**
         * This method will call on message send button click
         */
        this.onMessageSend = function (messageType) {
            _this.enableDisableSendButton();
            var candidateScriptId = undefined;
            var markGroupId = undefined;
            var esMarkGroupId = undefined;
            _this.messageBody = tinymce.get(_this.msgEditorId).getContent();
            switch (messageType) {
                case enums.MessageType.ResponseCompose:
                case enums.MessageType.ResponseReply:
                case enums.MessageType.ResponseForward:
                    // selected Qig id for compose message in response screen
                    _this.selectedQigItemId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                    _this.questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
                    var openedResponseDetails = _this.props.responseId ?
                        markerOperationModeFactory.operationMode.openedResponseDetails(_this.props.responseId.toString()) : null;
                    var isEsResponse = (worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation
                        || worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
                        worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation
                        || markerOperationModeFactory.operationMode.isStandardisationSetupMode) ? true : false;
                    if (openedResponseDetails) {
                        candidateScriptId = openedResponseDetails.candidateScriptId;
                        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                            esMarkGroupId = openedResponseDetails.esMarkGroupId;
                        }
                        else {
                            markGroupId = isEsResponse ? undefined : openedResponseDetails.markGroupId;
                            esMarkGroupId = isEsResponse ? openedResponseDetails.markGroupId : undefined;
                        }
                    }
                    break;
                // Not setting candidateScriptId, markGroupId, esMarkGroupId if composing message from response and worklist
                // since not associated with any particular response.
                case enums.MessageType.InboxCompose:
                case enums.MessageType.WorklistCompose:
                    break;
                default:
                    var currentMessageDetails = _this.props.selectedMsgDetails;
                    if (currentMessageDetails !== undefined && currentMessageDetails !== null) {
                        candidateScriptId = currentMessageDetails.candidateScriptId;
                        markGroupId = currentMessageDetails.markGroupId;
                        esMarkGroupId = currentMessageDetails.esMarkGroupId;
                    }
                    break;
            }
            // fetching currently selected qig's examiner roleId
            var examinerRoleId = 0;
            var msg = messageStore.instance.messagesMarkSchemes;
            if (msg) {
                msg.forEach(function (message) {
                    if (message.markSchemeGroupId === _this.selectedQigItemId) {
                        examinerRoleId = message.examinerRoleId;
                    }
                });
            }
            var toTeam = messageStore.instance.teamDetails ? messageStore.instance.teamDetails.team.toTeam : false;
            messagingActionCreator.sendExaminerMessage(_this.toFieldIds, _this.messageBody, _this.messageSubject, _this.questionPaperPartId, _this.props.responseId, _this.priorityDropDownSelectedItem, _this.selectedQigItemId, candidateScriptId, markGroupId, esMarkGroupId, toTeam, examinerRoleId);
        };
        /**
         * Navigating away from message panel when the pop up is opened
         */
        this.onNavigateFromMessagePanel = function (messageNavigationArguments) {
            if (messageNavigationArguments.hasMessageContainsDirtyValue === undefined) {
                // Should be possible to open the response, If the message composed from Team management
                if (_this.isMessagePanelEdited) {
                    messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
                    // To maximise the message panel when the discard popup is shown
                    _this.isMessagePopupMinimized = false;
                    _this.setState({ renderedOn: Date.now() });
                    messageNavigationArguments.hasMessageContainsDirtyValue = true;
                    messagingActionCreator.canMessageNavigate(messageNavigationArguments);
                }
                else if (!messageNavigationArguments.canNavigate) {
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    messageNavigationArguments.hasMessageContainsDirtyValue = false;
                    if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newException) {
                        _this.navigateTo = enums.SaveAndNavigate.newExceptionButtonClick;
                    }
                    else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.exceptionWithInResponse) {
                        _this.navigateTo = enums.SaveAndNavigate.exceptionWithInResponse;
                    }
                    else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newExceptionFromMediaErrorDialog) {
                        _this.navigateTo = enums.SaveAndNavigate.newExceptionFromMediaErrorDialog;
                    }
                    _this.resetAndCloseMessagePanel();
                    messageNavigationArguments.canNavigate = true;
                    messagingActionCreator.canMessageNavigate(messageNavigationArguments);
                }
            }
            else if (messageNavigationArguments.hasMessageContainsDirtyValue && messageNavigationArguments.canNavigate) {
                _this.isMessagePopupMinimized = false;
                if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newException) {
                    _this.navigateTo = enums.SaveAndNavigate.newExceptionButtonClick;
                }
                else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.exceptionWithInResponse) {
                    _this.navigateTo = enums.SaveAndNavigate.exceptionWithInResponse;
                }
                else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newExceptionFromMediaErrorDialog) {
                    _this.navigateTo = enums.SaveAndNavigate.newExceptionFromMediaErrorDialog;
                }
                _this.resetAndCloseMessagePanel();
            }
        };
        /**
         * checks whether the supervisor examiner is valid to send a message or not
         */
        this.messageSendValidationCheck = function (messageType) {
            _this.sendMessageActionInProgress = true;
            _this.messageType = messageType;
            // While in SEP view we need to check whether the supervisor examiner is valid to send a message to subordinate examiner
            if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
                _this.enableDisableSendButton();
                var dataCollection = new Array();
                var examinerSEPAction = {
                    examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                    requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
                };
                dataCollection.push(examinerSEPAction);
                var examinerSEPActions = Immutable.List(dataCollection);
                var doSEPApprovalManagementActionArgument = {
                    actionIdentifier: enums.SEPAction.SendMessage,
                    examiners: examinerSEPActions
                };
                teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
            }
            else {
                _this.onMessageSend(_this.messageType);
            }
        };
        /**
         * To check whether the examiner is valid to send a message
         */
        this.examinerValidation = function (actionIdentifier) {
            // No need to handle, If user clicks help examiners and immidietly navigated to inbox
            if (_this.props.messageType === enums.MessageType.InboxCompose) {
                return;
            }
            // If there is no failure code then the supervisor examiner is valid to send a message
            if (actionIdentifier === enums.SEPAction.SendMessage) {
                _this.onMessageSend(_this.messageType);
            }
        };
        /**
         * enable send button state on offline
         */
        this.onOnlineStatusChanged = function () {
            if (!applicationStore.instance.isOnline) {
                _this.toggleSaveButtonState();
            }
        };
        this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
        this.isSendButtonDisabled = true;
        this.messageSubject = '';
        this.messageBody = '';
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.isSubordinateSelected = false;
    }
    Object.defineProperty(MessageBase.prototype, "isMessagePanelEdited", {
        /**
         * Returns a boolean indicating whether the message panel is edited.
         */
        get: function () {
            return messageHelper.isMessagePanelEdited(this.props.messageType, this.toFieldValues, this.toFieldIds);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the enable/disable status of send button.
     */
    MessageBase.prototype.enableDisableSendButton = function () {
        var currentSendButtonStatusAfterChange = true;
        var activeEditorgetContentLength = 0;
        // if sending message is in progress no need to execute logic to enabling/ disabling button
        if (!this.sendMessageActionInProgress) {
            var activeEditor = tinymce.get(this.msgEditorId);
            //Defect Id:48277 First time active Editor does not contains 'Body' Then throws exception 'Body Undefined'
            if (activeEditor && activeEditor.contentDocument != null) {
                activeEditorgetContentLength = activeEditor.getContent({ format: 'text' }).trim().length;
            }
            if (this.props.messageType === enums.MessageType.InboxCompose ||
                this.props.messageType === enums.MessageType.ResponseCompose
                || this.props.messageType === enums.MessageType.WorklistCompose ||
                this.props.messageType === enums.MessageType.ResponseReply
                || this.props.messageType === enums.MessageType.ResponseForward ||
                this.props.messageType === enums.MessageType.TeamCompose) {
                currentSendButtonStatusAfterChange = !(this.messageSubject.trim().length > 0 &&
                    (this.toFieldIds && this.toFieldIds.length > 0)
                    && (this.toFieldValues && this.toFieldValues.length > 0)
                    && (activeEditorgetContentLength > 0 ||
                        messageHelper._isPasteEnabled));
            }
            else if (this.props.messageType === enums.MessageType.InboxForward ||
                this.props.messageType === enums.MessageType.InboxReply) {
                currentSendButtonStatusAfterChange = !(this.messageSubject.trim().length > 0
                    && (this.toFieldIds && this.toFieldIds.length > 0)
                    && (this.toFieldValues && this.toFieldValues.length > 0)
                    && this.selectedQigItemId > 1
                    && (activeEditorgetContentLength > 0
                        || messageHelper._isPasteEnabled));
            }
        }
        else {
            // disable send button when send message action is in progress if the application is online
            currentSendButtonStatusAfterChange = applicationStore.instance.isOnline;
        }
        if (this.isSendButtonDisabled !== currentSendButtonStatusAfterChange) {
            this.isSendButtonDisabled = currentSendButtonStatusAfterChange;
            // It is noticed due to render in same time, state change not happening. Add some extra time for rendering.
            this.setState({ renderedOn: Date.now() + 10 });
        }
        // Reset setPasteEnabledAction as false after the paste action fired.
        messageHelper.setPasteEnabledAction(false);
    };
    return MessageBase;
}(pureRenderComponent));
module.exports = MessageBase;
//# sourceMappingURL=messagebase.js.map