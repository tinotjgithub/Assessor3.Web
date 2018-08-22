"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var MessagePriorityDropDown = require('./messageprioritydropdown');
var localeStore = require('../../stores/locale/localestore');
var GenericButton = require('../utility/genericbutton');
var messageStore = require('../../stores/message/messagestore');
var enums = require('../utility/enums');
var MessageBase = require('./messagebase');
var MessageEditor = require('./messageeditor');
var Subject = require('./subject');
var classNames = require('classnames');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var popupHelper = require('../utility/popup/popuphelper');
var QigDropDown = require('../utility/dropdown');
var messageHelper = require('../utility/message/messagehelper');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var TeamListPopup = require('./teamlistpopup');
var configurablecharacteristicshelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurablecharacteristicsnames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var MessagePopup = (function (_super) {
    __extends(MessagePopup, _super);
    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    function MessagePopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isShowTeamListPopup = false;
        this._isEntireTeamSelected = false;
        this._mandatoryMessagesFromMarkingToolCC = false;
        this.doTriggerMessageOpenEvent = false;
        /**
         * This method will render QIG section for Compose, Reply and Forward message types
         */
        this.renderQigSection = function () {
            switch (_this.props.messageType) {
                case enums.MessageType.InboxCompose:
                    return (React.createElement("div", {className: 'message-qig'}, React.createElement("span", {className: 'dim-text msg-qig-label', id: 'qig-dropdown-label'}, localeStore.instance.TranslateText('messaging.compose-message.question-group') + ':'), React.createElement(QigDropDown, {dropDownType: enums.DropDownType.QIG, id: 'select_qig', style: _this.state.qigDropDownStyle, className: 'dropdown-wrap message-qig-name', selectedItem: _this.selectedQig, isOpen: _this.clickedDropDown === enums.DropDownType.QIG ? _this.isQigDropDownOpen : undefined, items: _this.props.qigItemsList, onClick: _this.onQigDropDownClick, onSelect: _this.onQigItemSelected, title: localeStore.instance.TranslateText('messaging.compose-message.question-group-tooltip')})));
                case enums.MessageType.InboxForward:
                case enums.MessageType.InboxReply:
                case enums.MessageType.WorklistCompose:
                case enums.MessageType.TeamCompose:
                    return (React.createElement("div", {className: 'message-qig'}, React.createElement("span", {className: 'dim-text msg-qig-label', id: 'question-group-text'}, localeStore.instance.TranslateText('messaging.compose-message.question-group') + ':'), React.createElement("div", {className: 'message-qig-name', id: 'selected-qig-name'}, _this.selectedQig)));
            }
        };
        /**
         * This method will return associtated response section for Forward and Reply message types
         */
        this.renderAssociatedResponseSection = function () {
            if ((_this.props.messageType === enums.MessageType.InboxForward || _this.props.messageType === enums.MessageType.InboxReply)
                && (_this.props.responseId != null && _this.props.responseId !== '' && _this.props.responseId !== undefined)) {
                return (React.createElement("div", {className: 'clearfix padding-bottom-10'}, React.createElement("div", {className: 'comp-resp-id shift-left'}, React.createElement("span", {className: 'dim-text', id: 'associated-response-text'}, localeStore.instance.TranslateText('messaging.compose-message.associated-response') + ':'), React.createElement("div", {className: 'message-resonse-id', id: 'associated-response-id'}, _this.props.responseId))));
            }
        };
        /**
         * This method will call on qig dropdown select
         */
        this.onQigItemSelected = function (selectedItem) {
            // resetting to standard message priority while qig selected
            _this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
            _this.props.onQigItemSelected(selectedItem);
            var selectedQigItem = _this.props.qigItemsList.filter(function (x) { return x.id === selectedItem; });
            var qigId = selectedItem;
            var examinerRoleId = selectedQigItem[0].examinerRoleId;
            var args = {
                examinerRoleId: examinerRoleId,
                qigId: qigId
            };
            messagingActionCreator.getTeamDetails(args);
        };
        /**
         * On navigate away from inbox
         */
        this.onNavigateAwayFromInbox = function (navigateTo) {
            if ((navigateTo === enums.SaveAndNavigate.toReplyMessage || navigateTo === enums.SaveAndNavigate.toForwardMessage ||
                navigateTo === enums.SaveAndNavigate.newMessageButtonClick)
                && !messageHelper.isMessagePanelEdited(_this.props.messageType, _this.toFieldValues, _this.toFieldIds)) {
                _this.props.onResetPopupCallback(navigateTo);
            }
            else {
                _this.onNavigateAwayFromResponse(navigateTo);
            }
        };
        /**
         *  This will set the required variables
         */
        this.onOpen = function (messageType) {
            // if tinymce is not loaded we need to skip this method and retrigger this after editor is loaded
            if (!_this.state.isTinyMCELoaded) {
                _this.doTriggerMessageOpenEvent = true;
                _this.msgType = messageType;
                return;
            }
            // if message type is inbox compose or worklist compose then set the default content for setting default fonts
            if (messageType === enums.MessageType.InboxCompose || messageType === enums.MessageType.WorklistCompose ||
                messageType === enums.MessageType.TeamCompose) {
                _this.messageBody = messageHelper.getMessageContent(messageType);
                if (_this.isMessagePopupMinimized === true) {
                    _this.onMaximizeMessagePanel();
                }
            }
            // if message type is work list compose then set supervisior details in to address fields.
            if (messageType === enums.MessageType.WorklistCompose || messageType === enums.MessageType.TeamCompose) {
                _this._selectedTeamList = new Array();
                _this.toFieldIds = new Array();
                _this.toFieldValues = new Array();
                _this.toFieldIds.push(_this.props.supervisorId);
                _this.toFieldValues.push(_this.props.supervisorName);
                _this._selectedTeamList.push(_this.props.supervisorName);
            }
            // Fix for defect 54276. Reply forward message details has to be set only once. 
            if (messageType === enums.MessageType.InboxReply || messageType === enums.MessageType.InboxForward) {
                _this.setInboxForwardReplyMessageDetails();
            }
            // Fix for defect 54276. Reply forward message details has to be set only once. 
            if (messageType === enums.MessageType.InboxReply || messageType === enums.MessageType.InboxForward) {
                _this.setInboxForwardReplyMessageDetails();
            }
            // Fix for defect 54276. Reply forward message details has to be set only once. 
            if (messageType === enums.MessageType.InboxReply || messageType === enums.MessageType.InboxForward) {
                _this.setInboxForwardReplyMessageDetails();
            }
            _this.setState({ renderedOn: Date.now() });
            // enable send button
            _this.enableDisableSendButton();
        };
        /**
         * Method fired to minimize the message panel.
         */
        this.onMinimizeMessagePanel = function () {
            // added as part of defect #29269
            if (htmlUtilities.isIPadDevice) {
                htmlUtilities.setFocusToElement('message-subject');
                htmlUtilities.blurElement('message-subject');
            }
            _this.isMessagePopupMinimized = true;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Method fired to maximize the message panel.
         */
        this.onMaximizeMessagePanel = function () {
            _this.isMessagePopupMinimized = false;
            _this.setState({ renderedOn: Date.now() });
            // enable send button
            _this.enableDisableSendButton();
        };
        /**
         * Method fired to close the message panel.
         */
        this.onMessagePanelClose = function () {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
            _this.isMessagePopupMinimized = false;
            _this.messageSubject = '';
            if (_this.selectedQigItemId && _this.selectedQigItemId !== 0) {
                var selectedQigItem = _this.props.qigItemsList.filter(function (x) { return x.id === _this.selectedQigItemId; });
                if (selectedQigItem && selectedQigItem.length > 0) {
                    var qigId = _this.selectedQigItemId;
                    var examinerRoleId = selectedQigItem[0].examinerRoleId;
                    messagingActionCreator.clearTeamSelection(examinerRoleId);
                }
            }
            _this._selectedTeamList = new Array();
            _this._isEntireTeamSelected = false;
            /**
             * Defect 64542 fix: setting isShowTeamListPopup to false to prevent TeamList Popup from persisting
             * when closing and opening a new message with only 1 QIG item
             */
            _this.isShowTeamListPopup = false;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * This method is handling the letious popup events.
         */
        this.onPopUpDisplayEvent = function (popUpType, popUpActionType) {
            switch (popUpType) {
                case enums.PopUpType.DiscardMessage:
                case enums.PopUpType.DiscardMessageNavigateAway:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            popupHelper.handlePopUpEvents(popUpType, popUpActionType, _this.onDiscardMessageConfirmed);
                            break;
                        case enums.PopUpActionType.No:
                            popupHelper.handlePopUpEvents(popUpType, popUpActionType, _this.onDiscardMessageCancelled);
                            break;
                    }
                    break;
                case enums.PopUpType.DiscardOnNewMessageButtonClick:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Show:
                            _this.isMessagePopupMinimized = false;
                            _this.setState({ renderedOn: Date.now() });
                            break;
                        case enums.PopUpActionType.Yes:
                            popupHelper.handlePopUpEvents(popUpType, popUpActionType, _this.onDiscardNewPopupConfirmed);
                            break;
                        case enums.PopUpActionType.No:
                            //Reset the navigate to variable when the user chooses to stay on the message panel
                            _this.navigateTo = enums.SaveAndNavigate.none;
                    }
                    break;
            }
        };
        this.onDiscardNewPopupConfirmed = function () {
            if (_this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick) {
                _this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
                _this.messageSubject = '';
                _this.messageBody = '';
                _this.isDropDownOpen = undefined;
                _this.isQigDropDownOpen = undefined;
                _this.toFieldValues = null;
                _this.toFieldIds = null;
                _this._selectedTeamList = new Array();
                _this._isEntireTeamSelected = false;
                tinymce.activeEditor.setContent('');
                _this.enableDisableSendButton();
                _this.props.onResetPopupCallback(_this.navigateTo);
            }
            else {
                _this.props.onResetPopupCallback(_this.navigateTo);
            }
            _this.navigateTo = enums.SaveAndNavigate.none;
        };
        /**
         *  Callback function for dropdown click
         */
        this.onQigDropDownClick = function (dropDown, width) {
            if (width) {
                var style = {};
                style.minWidth = width;
                _this.setState({
                    qigDropDownStyle: style
                });
            }
            _this.onDropDownClick(dropDown);
        };
        this.showToAddressList = function () {
            _this.isShowTeamListPopup = true;
            _this.setState({ renderedOn: Date.now() });
        };
        this.hideToAddressList = function () {
            _this.setState({ isshowToAddressList: false });
        };
        this.saveToAddressList = function () {
            _this.setState({ isshowToAddressList: false });
        };
        /**
         * Handles the action event on team list Received.
         */
        this.updatedTeamListReceived = function (isSaved) {
            if (isSaved === void 0) { isSaved = false; }
            _this.toFieldValues = new Array();
            _this.toFieldIds = new Array();
            _this._selectedTeamList = new Array();
            _this._isEntireTeamSelected = false;
            _this.isSubordinateSelected = false;
            var teams = messageStore.instance.teamDetails;
            if (teams && teams.team) {
                if (teams.team.toTeam) {
                    _this._isEntireTeamSelected = true;
                    _this.isSubordinateSelected = true;
                }
                else {
                    if (teams.team.parent && teams.team.parent.isChecked) {
                        _this._selectedTeamList.push(teams.team.parent.fullName + ';');
                    }
                    if (teams.team.subordinates.length > 0) {
                        _this.getSelectedSubordinateList(teams.team.subordinates);
                    }
                }
                // the logged in user has subordinates, check the store for new TO list
                // if there are no subordinates, the the supervisor details (if any) will be populated via props
                if (messageStore.instance.teamDetails.team.subordinates &&
                    messageStore.instance.teamDetails.team.subordinates.length > 0) {
                    _this.populateToField(teams.team);
                }
                _this.isShowTeamListPopup = false;
                if (isSaved && _this.priorityDropDownSelectedItem === enums.MessagePriority.Mandatory &&
                    !_this.isSubordinateSelected) {
                    messagingActionCreator.displayMandatoryValidationPopup(true);
                }
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * Populates the To Fields based on the values in the store
         */
        this.populateToField = function (team) {
            if (team) {
                // Add Parent Examiner of the current examiner if the parent is selected
                if (team.isCurrentExaminer && team.parent && team.parent.isChecked) {
                    _this.toFieldIds.push(team.parent.examinerId);
                    _this.toFieldValues.push(team.parent.fullName);
                }
                if (!team.isCurrentExaminer && team.isChecked) {
                    _this.toFieldIds.push(team.examinerId);
                    _this.toFieldValues.push(team.fullName);
                }
                for (var _i = 0, _a = team.subordinates; _i < _a.length; _i++) {
                    var subTeam = _a[_i];
                    _this.populateToField(subTeam);
                }
            }
        };
        /**
         * Handles the action event on To address list Received.
         */
        this.teamListReceived = function () {
            var teams = messageStore.instance.teamDetails;
            var qigId = _this.props.selectedQigItemId;
            _this._disableToButtonForStandardisationQig = false;
            //Flag to identify whether the qig is in standardisation setup progress
            var selectedQig = _this.props.qigItemsList.filter(function (x) { return x.id === _this.selectedQigItemId; });
            var coordinationComplete = selectedQig[0].coordinationComplete;
            if (teams && teams.team.subordinates) {
                _this._isEntireTeamSelected = teams.team.toTeam;
                _this.toFieldValues = new Array();
                _this.toFieldIds = new Array();
                _this._selectedTeamList = new Array();
                if (_this.props.messageType === enums.MessageType.InboxReply) {
                    _this.toFieldIds.push(_this.props.selectedMessage.fromExaminerId);
                    _this.toFieldValues.push(_this.props.selectedMessage.examinerDetails.fullName);
                    _this._selectedTeamList.push(_this.props.selectedMessage.examinerDetails.fullName);
                    _this.isSubordinateSelected = _this.isReplyToSubordinate(teams.team.subordinates);
                }
                else if (!coordinationComplete) {
                    // If the message is against standardisationsetup qig or response the receiver 
                    // should be stm parent else all work as existing
                    if (teams.team.stmParent) {
                        _this.toFieldIds.push(teams.team.stmParent.examinerId);
                        _this.toFieldValues.push(teams.team.stmParent.fullName);
                        _this._selectedTeamList.push(teams.team.stmParent.fullName);
                        _this.isShowTeamListPopup = false;
                        _this.isSubordinateSelected = false;
                        // Disabling button if the user sends message against standardisation response or Qig
                        _this._disableToButtonForStandardisationQig = true;
                    }
                }
                else if (teams.team.subordinates.length === 0) {
                    if (teams.team.parent) {
                        _this.setMessagePanelToTabForParent(teams.team.parent);
                    }
                }
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Handles the action event on To address list Received.
         */
        this.messagePriorityUpdate = function () {
            _this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Set the selected language state upon successfull confirmation from locale store.
         */
        this.languageChanged = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Handles the action event on To address list Received.
         */
        this.isTinyMCELoaded = function (isLoaded) {
            _this.setState({
                isTinyMCELoaded: isLoaded
            });
        };
        // Set the default states
        this.state = {
            renderedOn: 0,
            qigDropDownStyle: {},
            isTinyMCELoaded: false
        };
        this._selectedTeamList = new Array();
        this.teamListReceived = this.teamListReceived.bind(this);
        this._mandatoryMessagesFromMarkingToolCC = configurablecharacteristicshelper.getCharacteristicValue(configurablecharacteristicsnames.MandatoryMessagesFromMarkingTool).toLowerCase() === 'true' ? true : false;
        this.doShowMandatoryMessagePriority = this.doShowMandatoryMessagePriority.bind(this);
        this.doHideToButton = this.doHideToButton.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    MessagePopup.prototype.render = function () {
        var _this = this;
        var addressListPopup = this.isShowTeamListPopup ? (React.createElement(TeamListPopup, {isShowTeamListPopup: this.isShowTeamListPopup, id: 'teamlist-popup', key: 'teamlist-popup', selectedLanguage: this.props.selectedLanguage})) : null;
        var toAddressListPopup = (React.createElement("div", null, React.createElement("button", {className: 'secondary rounded popup-nav to-address-btn', "aria-haspopup": 'true', "data-popup": 'addressListPopUp', onClick: this.showToAddressList, id: 'messageToButton', key: 'messageToButton_key', disabled: this.doDisableToButton()}, localeStore.instance.TranslateText('messaging.compose-message.to-button')), addressListPopup));
        var _showMandatoryMessagePriority = this.doShowMandatoryMessagePriority();
        var _doHideToButton = this.doHideToButton();
        return (React.createElement("div", {className: classNames('popup full-width popup-overlay  messaging', { 'open': this.props.isOpen }, { 'minimized': this.isMessagePopupMinimized }), id: 'composeMessage', role: 'dialog', "aria-labelledby": 'popup2Title', "aria-describedby": 'popup2Desc'}, React.createElement("div", {className: 'popup-wrap compose-new-msg'}, React.createElement("div", {className: 'popup-content', id: 'popup2Desc'}, React.createElement("div", {className: 'comp-msg-top'}, React.createElement("div", {className: 'qig-menu-holder'}, this.renderQigSection(), React.createElement("div", {className: 'set-priority'}, React.createElement(MessagePriorityDropDown, {id: 'select_priority', dropDownType: enums.DropDownType.Priority, className: 'dropdown-wrap align-right', selectedItem: this.getPriorityDropDownItem(this.priorityDropDownSelectedItem), isOpen: this.clickedDropDown === enums.DropDownType.Priority ? this.isDropDownOpen : undefined, items: [{
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
            } : null], onClick: this.onDropDownClick, onSelect: this.onSelect}))), this.renderAssociatedResponseSection(), React.createElement("div", {className: 'msg-recipient-wrap'}, React.createElement("div", {className: 'rec-address-label', id: 'message-popup-to-label'}, _doHideToButton ?
            localeStore.instance.TranslateText('messaging.compose-message.to-button') + ':' :
            toAddressListPopup), React.createElement("div", {className: 'recipiants-list-wrap'}, this._isEntireTeamSelected ?
            React.createElement("span", {className: 'recipiant-name', id: 'message-recipiant-name'}, localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team') + ';') :
            this._selectedTeamList.map(function (item, index) {
                return React.createElement("span", {className: 'recipiant-name', key: 'recipiant-name' + index.toString()}, item);
            }))), React.createElement("div", {className: 'comp-subject-wrap'}, React.createElement("label", {htmlFor: 'message-subject', id: 'subject-label-popup', className: 'comp-subject-label'}, localeStore.instance.TranslateText('messaging.compose-message.subject') + ':'), React.createElement(Subject, {id: 'message-subject', key: 'key-message-subject', outerClass: 'subject-input-wrap', refName: 'subjectInput', hasFocus: (this.props.messageType === enums.MessageType.InboxCompose ||
            this.props.messageType === enums.MessageType.WorklistCompose ||
            this.props.messageType === enums.MessageType.TeamCompose), className: 'subject-input', onChange: this.handleSubjectChange, maxLength: 120, isVisible: this.props.isOpen, value: this.messageSubject}))), React.createElement("div", {className: 'comp-msg-bottom', ref: 'msgEditor'}, React.createElement("div", {className: 'msg-editor'}, React.createElement(MessageEditor, {htmlContent: this.messageBody, id: this.msgEditorId, key: 'key-' + this.msgEditorId, hasFocus: messageHelper.hasFocus(this.props.messageType), "aria-label": this.msgEditorId, toggleSaveButtonState: this.toggleSaveButtonState, selectedLanguage: this.props.selectedLanguage, isTinyMCELoaded: this.isTinyMCELoaded})))), React.createElement("div", {className: 'popup-header compose-msg-header'}, React.createElement("h3", {id: 'popup2Title', className: 'shift-left comp-msg-title'}, messageHelper.getMessageHeader(this.props.messageType)), React.createElement("div", {className: 'shift-left comp-msg-butons'}, React.createElement(GenericButton, {id: 'message_send_btn', key: 'key_message_send_btn', className: 'button primary rounded', title: localeStore.instance.TranslateText('messaging.compose-message.send-button-tooltip'), content: localeStore.instance.TranslateText('messaging.compose-message.send-button'), disabled: this.isSendButtonDisabled || this.isShowTeamListPopup, onClick: function () { _this.messageSendValidationCheck(_this.props.messageType); }})), React.createElement("div", {className: 'shift-right minimize-message'}, React.createElement("a", {href: 'javascript:void(0)', className: 'minimize-message-link', id: 'message-minimize', title: localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip'), onClick: this.onMinimize}, React.createElement("span", {className: 'minimize-icon lite'}, localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip'))), React.createElement("a", {href: 'javascript:void(0)', className: 'maximize-message-link', id: 'message-maximize', title: localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip'), onClick: this.onMaximize}, React.createElement("span", {className: 'maxmize-icon lite'}, localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip'))), React.createElement("a", {href: 'javascript:void(0)', className: 'close-message-link', title: localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip'), id: 'message-close', onClick: this.onMessageClose}, React.createElement("span", {className: 'close-icon lite'}, localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip'))))))));
    };
    /**
     * Component did mount
     */
    MessagePopup.prototype.componentDidMount = function () {
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onOpen);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromInbox);
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        window.addEventListener('click', this._boundHandleOnClick);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.onMinimizeMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.onMaximizeMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_TEAM_LIST_RECEIVED, this.updatedTeamListReceived);
        messageStore.instance.addListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT, this.messagePriorityUpdate);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        // Set the variables from props.
        if (this.props.messageType === enums.MessageType.TeamCompose) {
            this.selectedQig = this.props.selectedQigItem;
            this.selectedQigItemId = this.props.selectedQigItemId;
            this.questionPaperPartId = this.props.questionPaperPartId;
            this.onOpen(enums.MessageType.TeamCompose);
        }
    };
    /**
     * Component will unmount
     */
    MessagePopup.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onOpen);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromInbox);
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        window.removeEventListener('click', this._boundHandleOnClick);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.onMinimizeMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.onMaximizeMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        if (messageStore.instance.messageViewAction !== enums.MessageViewAction.None) {
            messagingActionCreator.messageAction(enums.MessageViewAction.None);
        }
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_TEAM_LIST_RECEIVED, this.updatedTeamListReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT, this.messagePriorityUpdate);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    };
    /**
     * Component will receive props
     * @param {Props} nextProps
     */
    MessagePopup.prototype.componentWillReceiveProps = function (nextProps) {
        // Defect 44392 fix - select a qig text in message area is not getting localized upon changing language 
        if (nextProps.selectedQigItemId > 0) {
            this.selectedQig = nextProps.selectedQigItem;
        }
        else {
            this.selectedQig = localeStore.instance.TranslateText('messaging.compose-message.select-qig-placeholder');
        }
        this.selectedQigItemId = nextProps.selectedQigItemId;
        this.questionPaperPartId = nextProps.questionPaperPartId;
        // to close teamlist popup while opening new message
        if (this.selectedQigItemId === 0) {
            this.isShowTeamListPopup = false;
        }
    };
    /**
     * Set Inbox Forward and Replay Message details
     */
    MessagePopup.prototype.setInboxForwardReplyMessageDetails = function () {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        // set messageSubject for reply and forward messages
        if ((this.props.messageType === enums.MessageType.InboxForward || this.props.messageType === enums.MessageType.InboxReply)
            && this.props.isReplyOrForwardClicked && this.props.selectedMessage) {
            // reset isMessagePopupMinimized variable
            this.isMessagePopupMinimized = false;
            this.messageSubject = messageHelper.getSubjectContent(this.props.messageType, this.props.subject);
            this.priorityDropDownSelectedItem = this.props.priorityDropDownSelectedItem;
            this.messageBody = this.props.messageBody;
            var qigId_1 = this.props.selectedQigItemId;
            var examinerRoleId = this.props.qigItemsList.filter(function (x) { return x.id === qigId_1; })[0].examinerRoleId;
            var args = {
                examinerRoleId: examinerRoleId,
                qigId: qigId_1
            };
            // get the teamdetails to find whether atleast one subordinate is
            // selected(for displaying mandatory priority options)
            messagingActionCreator.getTeamDetails(args);
        }
    };
    /**
     * Component did update
     */
    MessagePopup.prototype.componentDidUpdate = function () {
        // enable or disable send button while changing QIG dropdown
        if (this.props.isOpen) {
            this.enableDisableSendButton();
        }
        if (this.doTriggerMessageOpenEvent) {
            this.doTriggerMessageOpenEvent = false;
            this.onOpen(this.msgType);
        }
    };
    /**
     * To avoid the qigs in which the selected examiner has no supervisor
     * @param {Array<Item>} qigItemsList
     * @returns
     */
    MessagePopup.prototype.filterQigItems = function (qigItemsList) {
        return qigItemsList.filter(function (x) { return x.parentExaminerId !== 0; });
    };
    /**
     * To show madatory message priority option in dropdown
     */
    MessagePopup.prototype.doShowMandatoryMessagePriority = function () {
        var _this = this;
        var isMandatoryPriorityAvailable = false;
        // Mandatory Message Priority is availability only if :
        // 1. It is a TeamCompose as TeamCompose is always to subordinates. OR
        // 2. If not WorklistCompose as WorklistCompose will be always to Supervisor. AND
        //      (i).[QIG is not selected.] OR
        //      (ii).[If QIG is selected AND there are no selected examiners.] OR
        //      (iii).[If QIG is selected AND there are selected examiners AND atleast one subordinate is selected.]
        // PS : ResponseCompose Scenarios are handled in message.tsx
        if (this.props.messageType === enums.MessageType.TeamCompose ||
            (this.props.messageType !== enums.MessageType.WorklistCompose &&
                (this.selectedQigItemId === 0 ||
                    (this.selectedQigItemId > 0 && this._selectedTeamList && this._selectedTeamList.length === 0) ||
                    (this.selectedQigItemId > 0 && this._selectedTeamList && this._selectedTeamList.length > 0 && this.isSubordinateSelected)))) {
            isMandatoryPriorityAvailable = true;
        }
        if (this.props.qigItemsList.length > 0 && this.selectedQigItemId > 0) {
            var selectedQig = this.props.qigItemsList.filter(function (x) { return x.id === _this.selectedQigItemId; });
            var currentExaminerApprovalStatus = selectedQig[0].approvalStatusId;
            if (currentExaminerApprovalStatus === enums.ExaminerApproval.NotApproved ||
                currentExaminerApprovalStatus === enums.ExaminerApproval.Suspended) {
                isMandatoryPriorityAvailable = false;
            }
        }
        return this._mandatoryMessagesFromMarkingToolCC && isMandatoryPriorityAvailable;
    };
    /**
     * show or hide 'To' button
     */
    MessagePopup.prototype.doHideToButton = function () {
        var _subordinates = null;
        if (messageStore.instance.teamDetails &&
            messageStore.instance.teamDetails.team &&
            messageStore.instance.teamDetails.team.subordinates) {
            _subordinates = messageStore.instance.teamDetails.team.subordinates;
        }
        return ((_subordinates && _subordinates.length) === 0 ||
            this.props.messageType === enums.MessageType.InboxReply ||
            this.props.messageType === enums.MessageType.WorklistCompose ||
            this.props.messageType === enums.MessageType.TeamCompose);
    };
    /**
     * Get selected subordinated list.
     */
    MessagePopup.prototype.getSelectedSubordinateList = function (teamList) {
        var that = this;
        teamList.map(function (examinerInfo) {
            if (examinerInfo.isChecked) {
                that.isSubordinateSelected = true;
                that._selectedTeamList.push(examinerInfo.fullName + ';');
            }
            if (examinerInfo.subordinates.length > 0) {
                that.getSelectedSubordinateList(examinerInfo.subordinates);
            }
        });
    };
    /**
     * Ensure Reply is done to a subordinate.
     */
    MessagePopup.prototype.isReplyToSubordinate = function (teamList) {
        // Suboridinates of the current examiner will be passed here
        // If the selectedMessage.fromExaminerId is one among them, set isSubordinate as true.
        var that = this;
        var isSubordinate = false;
        teamList.map(function (examinerInfo) {
            if (examinerInfo.examinerId === that.props.selectedMessage.fromExaminerId) {
                isSubordinate = true;
            }
            if (examinerInfo.subordinates.length > 0) {
                that.isReplyToSubordinate(examinerInfo.subordinates);
            }
        });
        return isSubordinate;
    };
    /**
     * This method will set message panel property for sending message to the parent
     */
    MessagePopup.prototype.setMessagePanelToTabForParent = function (parent) {
        this.toFieldIds.push(parent.examinerId);
        this.toFieldValues.push(parent.fullName);
        this._selectedTeamList.push(parent.fullName);
        this.isSubordinateSelected = false;
    };
    /**
     * check to enable to button
     */
    MessagePopup.prototype.doDisableToButton = function () {
        if (this.selectedQigItemId === 0 ||
            !messageStore.instance.teamDetails ||
            messageStore.instance.teamDetails.team.subordinates.length === 0 || this._disableToButtonForStandardisationQig) {
            return true;
        }
        return false;
    };
    return MessagePopup;
}(MessageBase));
module.exports = MessagePopup;
//# sourceMappingURL=messagepopup.js.map