"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var GenericButton = require('../utility/genericbutton');
var MessagePriorityDropDown = require('./messageprioritydropdown');
var MessageEditor = require('./messageeditor');
var Subject = require('./subject');
var messageStore = require('../../stores/message/messagestore');
var localeStore = require('../../stores/locale/localestore');
var MessageBase = require('./messagebase');
var enums = require('../utility/enums');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var qigStore = require('../../stores/qigselector/qigstore');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var MessageDetails = require('./messagerightpanel');
var classNames = require('classnames');
var popupHelper = require('../utility/popup/popuphelper');
var worklistStore = require('../../stores/worklist/workliststore');
var qiqStore = require('../../stores/qigselector/qigstore');
var messageHelper = require('../utility/message/messagehelper');
var operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var configurablecharacteristicshelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurablecharacteristicsnames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var markingStore = require('../../stores/marking/markingstore');
var Message = (function (_super) {
    __extends(Message, _super);
    /**
     * @constructor
     */
    function Message(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // message type
        this.currentMessageType = enums.MessageType.InboxCompose;
        // this variable will hold the message panel visiblity status.
        this.isMessagePopupVisible = false;
        this.selectedMsgDetails = null;
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        this.removeMandatoryMessagePriority = true;
        this._mandatoryMessagesFromMarkingToolCC = false;
        /**
         * This method is handling the letious popup events.
         */
        this.onPopUpDisplayEvent = function (popUpType, popUpActionType, popUpDisplayAction, actionFromCombinedPopup, navigateTo) {
            if (actionFromCombinedPopup === void 0) { actionFromCombinedPopup = false; }
            if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
            switch (popUpType) {
                case enums.PopUpType.DiscardMessage:
                case enums.PopUpType.DiscardMessageNavigateAway:
                case enums.PopUpType.DiscardOnNewMessageButtonClick:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            popupHelper.handlePopUpEvents(popUpType, popUpActionType, _this.onDiscardMessageConfirmed, actionFromCombinedPopup, navigateTo);
                            break;
                        case enums.PopUpActionType.No:
                            popupHelper.handlePopUpEvents(popUpType, popUpActionType, _this.onDiscardMessageCancelled);
                            break;
                    }
            }
        };
        /**
         * This method will return the supervisor details against a qig
         */
        this.getSupervisorAndQIGDetails = function (qigId) {
            var item = _this.qigListItems.filter(function (x) { return x.id === qigId; })[0];
            if (item) {
                _this.selectedQigItemId = item.id;
                _this.selectedQigItemDisplayed = item.name;
                _this.supervisorName = item.parentExaminerDisplayName;
                _this.supervisorId = item.parentExaminerId;
                _this.selectedQuestionPaperPartId = item.questionPaperPartId;
            }
        };
        /**
         * Handles the action event on To address list Received.
         */
        this.teamListReceived = function () {
            if (markerOperationModeFactory.operationMode.isRemoveMandatoryMessagePriorityRequired(_this.currentExaminerId)) {
                var teams = messageStore.instance.teamDetails;
                if (teams) {
                    if (teams.team.subordinates && teams.team.subordinates.length > 0) {
                        if (_this.props.messageType === enums.MessageType.ResponseReply) {
                            _this.removeMandatoryMessagePriority = true;
                            _this.getSubordinateList(teams.team.subordinates);
                        }
                    }
                    if (teams && teams.team.subordinates && teams.team.subordinates.length === 0) {
                        _this.removeMandatoryMessagePriority = true;
                    }
                }
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This method will set the subject and message body for reply and forward
         */
        this.setvariablesForReplyAndForward = function (messageType) {
            _this.priorityDropdownSelectedItem = messageHelper.getPriorityDropDownSelectedItem(_this.props.selectedMessage.priorityName);
            switch (messageType) {
                case enums.MessageType.ResponseReply:
                case enums.MessageType.ResponseForward:
                    _this.messageSubject = messageHelper.getSubjectContent(messageType, _this.props.selectedMessage.subject);
                    _this.messageBody = messageHelper.getMessageContent(messageType, _this.props.selectedMessage.examinerDetails.fullName, _this.props.selectedMessage.displayDate, _this.props.selectedMsgDetails.body);
                    if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                        var qigId = operationModeHelper.markSchemeGroupId;
                        var examinerRoleId = operationModeHelper.authorisedExaminerRoleId;
                        var args = {
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
        this.onMessagePanelOpen = function (messageType) {
            if (messageType === enums.MessageType.ResponseCompose) {
                _this.messageBody = messageHelper.getMessageContent(enums.MessageType.ResponseCompose);
                // Reset the Navigation after opening a message
                _this.navigateTo = enums.SaveAndNavigate.none;
                _this.setState({ renderedOn: Date.now() });
            }
        };
        // Set the default states
        this.state = {
            renderedOn: 0
        };
        this.teamListReceived = this.teamListReceived.bind(this);
        this._mandatoryMessagesFromMarkingToolCC = configurablecharacteristicshelper.getCharacteristicValue(configurablecharacteristicsnames.MandatoryMessagesFromMarkingTool).toLowerCase() === 'true' ? true : false;
        this.doShowMandatoryMessagePriority = this.doShowMandatoryMessagePriority.bind(this);
    }
    /**
     * Render method
     */
    Message.prototype.render = function () {
        if (this.props.messageType === enums.MessageType.ResponseDetails) {
            return (React.createElement("div", {className: 'response-message response-message-container'}, this.renderMessageHeader(), React.createElement(MessageDetails, {id: 'resp-msg-det', key: 'resp-msg-det', selectedLanguage: this.props.selectedLanguage, message: this.props.selectedMessage, isForwardButtonHidden: examinerStore.instance.parentExaminerId === 0, messageDetails: this.props.selectedMsgDetails, selectedTab: enums.MessageFolderType.None, onMessageMenuActionClickCallback: this.props.onMessageMenuActionClickCallback})));
        }
        var _showMandatoryMessagePriority = this.doShowMandatoryMessagePriority();
        this.currentExaminerName = this.currentExaminerName === undefined ?
            this.props.supervisorName : this.currentExaminerName;
        if (this.props.messageType === enums.MessageType.ResponseCompose && this.messageBody === '') {
            this.messageBody = messageHelper.getMessageContent(enums.MessageType.ResponseCompose);
        }
        return (React.createElement("div", {className: 'compose-new-msg response-message-container', id: 'message-container'}, this.renderMessageHeader(), React.createElement("div", {className: 'messaging-content'}, React.createElement("div", {className: 'comp-msg-top'}, React.createElement("div", {className: 'clearfix'}, React.createElement("div", {className: 'comp-resp-id shift-left'}, React.createElement("span", {className: 'dim-text', id: 'associated-response-id-text'}, localeStore.instance.TranslateText('messaging.compose-message.associated-response') + ': '), React.createElement("span", {className: 'message-resonse-id', id: 'associated-response-id'}, this.renderMessageResponseId())), React.createElement("div", {className: 'set-priority shift-right'}, React.createElement(MessagePriorityDropDown, {id: 'select_priority', dropDownType: enums.DropDownType.Priority, className: 'dropdown-wrap align-right', selectedItem: this.getPriorityDropDownItem(this.priorityDropDownSelectedItem), isOpen: this.clickedDropDown === enums.DropDownType.Priority ? this.isDropDownOpen : undefined, items: [{
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
            } : null], onClick: this.onDropDownClick, onSelect: this.onSelect}))), React.createElement("div", {className: 'msg-recipient-wrap'}, React.createElement("div", {className: 'rec-address-label', id: 'message-to-label'}, localeStore.instance.TranslateText('messaging.compose-message.to-button') + ': '), React.createElement("div", {className: 'recipiants-list-wrap'}, React.createElement("span", {className: 'recipiant-name', id: 'message-recipiant-name'}, this.currentExaminerName))), React.createElement("div", {className: 'comp-subject-wrap'}, React.createElement("label", {htmlFor: 'message-subject', id: 'subject-label', className: 'comp-subject-label'}, localeStore.instance.TranslateText('messaging.compose-message.subject') + ': '), React.createElement(Subject, {id: 'message-subject', key: 'key-message-subject', outerClass: 'subject-input-wrap', refName: 'subjectInput', hasFocus: this.props.messageType === enums.MessageType.ResponseCompose, className: 'subject-input', onChange: this.handleSubjectChange, maxLength: 120, isVisible: this.props.isMessagePanelVisible, value: this.messageSubject, callback: this.props.onMessageClose}))), React.createElement("div", {className: 'comp-msg-bottom', ref: 'msgEditor'}, React.createElement("div", {className: 'msg-editor'}, React.createElement(MessageEditor, {htmlContent: this.messageBody, hasFocus: messageHelper.hasFocus(this.props.messageType), id: this.msgEditorId, key: 'key-' + this.msgEditorId, toggleSaveButtonState: this.toggleSaveButtonState, selectedLanguage: this.props.selectedLanguage}))))));
    };
    /**
     * Method to render message header.
     */
    Message.prototype.renderMessageHeader = function () {
        return (React.createElement("div", {className: classNames('clearfix', { 'response-msg-header': this.props.messageType === enums.MessageType.ResponseDetails }, { 'compose-msg-header': this.props.messageType !== enums.MessageType.ResponseDetails })}, React.createElement("h3", {id: 'popup2Title', className: 'shift-left comp-msg-title'}, messageHelper.getMessageHeader(this.props.messageType)), this.sendButton(), React.createElement("div", {className: classNames('minimize-message', { 'shift-left': this.props.messageType === enums.MessageType.ResponseDetails }, { 'shift-right': this.props.messageType === enums.MessageType.ResponseCompose })}, React.createElement("a", {href: 'javascript:void(0)', className: 'minimize-message-link', id: 'message-minimize', title: localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip'), onClick: this.onMinimize}, React.createElement("span", {className: 'minimize-icon lite'}, "Minimize")), React.createElement("a", {href: 'javascript:void(0)', className: 'maximize-message-link', id: 'message-maximize', title: localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip'), onClick: this.onMaximize}, React.createElement("span", {className: 'maxmize-icon lite'}, localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip'))), React.createElement("a", {href: 'javascript:void(0)', className: 'close-message-link', title: localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip'), id: 'message-close', onClick: this.onMessageClose}, React.createElement("span", {className: 'close-icon lite'}, "Close")))));
    };
    /**
     * Send Button in compose Message
     */
    Message.prototype.sendButton = function () {
        var _this = this;
        if (this.props.messageType !== enums.MessageType.ResponseDetails) {
            return (React.createElement("div", {className: 'shift-left comp-msg-butons'}, React.createElement(GenericButton, {id: 'message_send_btn', key: 'key_message_send_btn', className: 'button primary rounded', title: localeStore.instance.TranslateText('messaging.compose-message.send-button-tooltip'), content: localeStore.instance.TranslateText('messaging.compose-message.send-button'), disabled: this.isSendButtonDisabled, onClick: function () { _this.messageSendValidationCheck(_this.props.messageType); }})));
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    Message.prototype.componentDidMount = function () {
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromResponse);
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        window.addEventListener('click', this._boundHandleOnClick);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        messageHelper.addInitMouseClickEventScriptBlock();
        messageStore.instance.addListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    Message.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromResponse);
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        window.removeEventListener('click', this._boundHandleOnClick);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        if (messageStore.instance.messageViewAction !== enums.MessageViewAction.None) {
            messagingActionCreator.messageAction(enums.MessageViewAction.None);
        }
        messageHelper.removeInitMouseClickEventScriptBlock();
        messageStore.instance.removeListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    };
    /**
     * componentWillReceiveProps
     * @param nextProps
     */
    Message.prototype.componentWillReceiveProps = function (nextProps) {
        // set to field values
        if (markerOperationModeFactory.operationMode.sendMessageToExaminer(nextProps.messageType)) {
            this.toFieldValues = new Array();
            this.toFieldIds = new Array();
            var _currentExaminerId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                standardisationSetupStore.instance.getProvisionalExaminerId(markingStore.instance.selectedDisplayId) :
                teamManagementStore.instance.examinerDrillDownData.examinerId;
            var _currentExaminerName = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                standardisationSetupStore.instance.getFormattedExaminerName(markingStore.instance.selectedDisplayId)
                : examinerStore.instance.getMarkerInformation.formattedExaminerName;
            this.toFieldIds.push(_currentExaminerId);
            this.toFieldValues.push(_currentExaminerName);
            this.currentExaminerName = _currentExaminerName;
            this.currentExaminerId = _currentExaminerId;
        }
        else if (nextProps.supervisorId > 0 && nextProps.supervisorName !== '') {
            this.toFieldValues = new Array();
            this.toFieldIds = new Array();
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
    };
    /**
     * This function gets invoked when the component is about to be updated
     */
    Message.prototype.componentDidUpdate = function () {
        // enable or disable send button while changing props
        this.enableDisableSendButton();
    };
    /**
     * This method revamps the naming for display in message
     */
    Message.prototype.renderMessageResponseId = function () {
        var workListType = worklistStore.instance.currentWorklistType;
        var markingMode = worklistStore.instance.getMarkingModeByWorkListType(workListType);
        if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            if (qiqStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true) {
                return ((localeStore.instance.TranslateText('marking.worklist.response-data.stm-standardisation-response-title')) + ' ' +
                    this.props.responseId);
            }
            else {
                return ((localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title')) + ' ' +
                    this.props.responseId);
            }
        }
        else if (workListType === enums.WorklistType.practice) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title')) + ' ' +
                this.props.responseId);
        }
        else if (workListType === enums.WorklistType.standardisation) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title')) + ' ' +
                this.props.responseId);
        }
        else if (workListType === enums.WorklistType.secondstandardisation) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title')) + ' ' +
                this.props.responseId);
        }
        else {
            return (this.props.responseId);
        }
    };
    /**
     * Close the message panel after deleting the message
     */
    Message.prototype.updateMessageDeletedStatus = function () {
        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
    };
    /**
     * Get selected subordinated list.
     */
    Message.prototype.getSubordinateList = function (teamList) {
        var that = this;
        teamList.map(function (examinerInfo) {
            if (examinerInfo.examinerId === that.props.selectedMessage.fromExaminerId) {
                that.removeMandatoryMessagePriority = false;
            }
            if (examinerInfo.subordinates.length > 0) {
                that.getSubordinateList(examinerInfo.subordinates);
            }
        });
    };
    /**
     * to show or hide mandatory message priority
     */
    Message.prototype.doShowMandatoryMessagePriority = function () {
        var currentExaminerApprovalStatus = enums.ExaminerApproval.None;
        if (examinerStore && examinerStore.instance.getMarkerInformation) {
            currentExaminerApprovalStatus = examinerStore.instance.getMarkerInformation.currentExaminerApprovalStatus;
        }
        if (currentExaminerApprovalStatus === enums.ExaminerApproval.NotApproved ||
            currentExaminerApprovalStatus === enums.ExaminerApproval.Suspended ||
            this.currentExaminerId === examinerStore.instance.parentExaminerId) {
            this.removeMandatoryMessagePriority = true;
        }
        else if ((markerOperationModeFactory.operationMode.isTeamManagementMode &&
            this.props.messageType === enums.MessageType.ResponseCompose)) {
            this.removeMandatoryMessagePriority = false;
        }
        else if (worklistStore.instance.isMarkingCheckMode && currentExaminerApprovalStatus === enums.ExaminerApproval.Approved &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer) {
            // Mandatory message option should be visible from Marking check is doing from parent.
            this.removeMandatoryMessagePriority = false;
        }
        return this._mandatoryMessagesFromMarkingToolCC && !this.removeMandatoryMessagePriority;
    };
    return Message;
}(MessageBase));
module.exports = Message;
//# sourceMappingURL=message.js.map