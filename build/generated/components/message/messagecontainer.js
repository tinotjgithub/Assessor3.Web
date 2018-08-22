"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
/**
 * Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor
 */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var immutable = require('immutable');
var loginSession = require('../../app/loginsession');
var classNames = require('classnames');
var Footer = require('../footer');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
/**
 * Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor
 */
/* tslint:disable:variable-name no-multiple-var-decl */
var navigationHelper, Header, notificationCount, MessageLeftPanel, MessageRightPanel, MessageTabItem, messageStore, ccStore, localeStore, MessagePopup, messagingActionCreator, GenericButton, stringFormatHelper, messageHelper, popUpDisplayActionCreator, popupHelper, markingHelper, ConfirmationDialog, responseStore, responseSearchHelper, responseActionCreator, messageTranslationHelper, GenericDialog, navigationStore, userInfoActionCreator, qigStore, userInfoStore, htmlUtilities, urls;
/**
 * Class to Display the Left Side Section
 */
var MessageContainer = (function (_super) {
    __extends(MessageContainer, _super);
    /**
     * Constructor Messagecontainer
     * @param props
     * @param state
     */
    function MessageContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // this variable will hold the message panel visiblity status.
        this.isMessagePopupVisible = false;
        this.selectedMsgDetails = null;
        this.selectedMsgReadStatus = 1;
        // message type
        this.currentMessageType = enums.MessageType.InboxCompose;
        this.subject = '';
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        this.isReplyOrForwardClicked = false;
        this.searchData = { isVisible: true, isSearching: undefined, searchText: '' };
        // contains qigId: number, isOpen: boolean
        this.inboxTabExpandOrCollapseDetails = immutable.Map();
        this.sentTabExpandOrCollapseDetails = immutable.Map();
        this.deletedTabExpandOrCollapseDetails = immutable.Map();
        this.isLoadingDataFailed = false;
        this.messageType = enums.MessageType.None;
        /**
         * This method will call on new message button click
         */
        this.onNewMessageClick = function () {
            // check online status before proceed
            _this.checkOnlineStatusAndDoMessageAction(enums.MessageType.InboxCompose);
        };
        /**
         * Callback function for message panel close
         */
        this.onCloseMessagePopup = function () {
            _this.isMessagePopupVisible = false;
            _this.isReplyOrForwardClicked = false;
            _this.currentMessageType = enums.MessageType.InboxCompose;
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            /* Defect:24608 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad */
            if (htmlUtilities.isIPadDevice) {
                htmlUtilities.setFocusToElement('message-subject');
                htmlUtilities.blurElement('message-subject');
            }
            // if selected tab is sent then update the message folder
            if (_this.selectedTab === enums.MessageFolderType.Sent) {
                // Load the messages
                _this.getMessagesForTheSelectedTab();
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Invoked when the selection changed in messages.
         */
        this.onMessageClick = function (newlySelectedMsg) {
            //DefectFix:#65417 Checking the online status, otherwise a blank screen will be shown in right panel
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
                // If the currently selected Item is Unread, Update the collection for updating the QIG group unread message count
                if (_this.selectedMsg.status === enums.MessageReadStatus.New) {
                    var messagesForGrouping = _this.filteredMessages;
                    if (_this.searchData.searchText !== '') {
                        // update the read status of previous message
                        _this.updateReadStatus(_this.selectedMsg);
                        // update the collection with read status to reflect the changes in view, otherwise it won't update due to delay
                        // in action creator call
                        messagesForGrouping.filter(function (x) { return x.examinerMessageId === _this.selectedMsg.examinerMessageId; }).first().status =
                            enums.MessageReadStatus.Read;
                    }
                    _this.messageGroupDetails = messageHelper.getGroupedMessageObject(messagesForGrouping, _this.expandOrCollapseDetails);
                    _this.updateNotification();
                }
                // we don't need to reflect the read status current message in UI untill to click on another message or navigate away.
                if (_this.searchData.searchText !== '' && newlySelectedMsg.status === enums.MessageReadStatus.New) {
                    // update the read status of current message
                    _this.updateReadStatus(newlySelectedMsg);
                }
                _this.selectedMsg = newlySelectedMsg;
                _this.selectedMsgDetails = null;
                messagingActionCreator.getMessageBodyDetails(_this.selectedMsg.examinerMessageId, _this.selectedTab);
                // Refresh the UI.
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Invoked When the message tab selected.
         */
        this.onTabSelected = function (messageFolderType) {
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
                _this.selectedTab = messageFolderType;
                // reset values for the new tab.
                _this.selectedMsg = undefined;
                _this.selectedMsgDetails = null;
                _this.messageGroupDetails.messages = undefined;
                _this.getMessagesForTheSelectedTab();
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Handles the action event on Message Received.
         */
        this.onMessagesReceived = function (selectedMsgId) {
            _this.searchData.isVisible = _this.selectedTab === enums.MessageFolderType.Inbox;
            if (_this.searchData.isSearching) {
                _this.searchData.isSearching = _this.searchData.searchText === '' ? undefined : false;
            }
            _this.messageGroupDetails = messageHelper.getGroupedMessageObject(_this.filteredMessages, _this.expandOrCollapseDetails);
            _this.updateNotification();
            _this.getQigItemsList();
            if (selectedMsgId > 0) {
                if (_this.messageGroupDetails && _this.messageGroupDetails.messages.count() > 0) {
                    _this.selectedMsg = _this.messageGroupDetails.messages.find(function (x) { return x.examinerMessageId === selectedMsgId; });
                    _this.selectedQigName = messageHelper.getDisplayText(_this.selectedMsg);
                }
            }
            else if (_this.messageGroupDetails.messages.count() > 0 && _this.selectedMsg === undefined) {
                // Default first message should be selected in the list. Select I f any message exists
                _this.selectedMsg = _this.messageGroupDetails.messages.first();
            }
            if (_this.selectedMsg !== undefined) {
                // Get the message data.
                messagingActionCreator.getMessageBodyDetails(_this.selectedMsg.examinerMessageId, _this.selectedTab);
            }
            _this.setState({
                renderedOn: Date.now()
            });
            // set the scroll position to the selected message for automatic selection
            if (selectedMsgId > 0) {
                var borderHeight = 30;
                var offsetTop = htmlUtilities.getOffsetTop('msg-item unread selected', false);
                htmlUtilities.setScrollTop('msg-list-container', offsetTop - borderHeight);
            }
        };
        /**
         * Handles the action event on Message Details Received.
         */
        this.onMessageDetailsReceived = function (msgId) {
            // Check the selection got changed while receives the message
            if (_this.selectedMsg.examinerMessageId === msgId) {
                _this.selectedMsgDetails = messageStore.instance.getMessageDetails(_this.selectedMsg.examinerMessageId);
                // update the default selected message if search filter is not applied.
                if (_this.searchData.searchText === '') {
                    _this.updateReadStatus(_this.selectedMsg);
                }
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This method will refresh the given message folder
         */
        this.onRefreshMessageTab = function (messageFolderType) {
            // change the selected tab to given folder
            _this.selectedTab = messageFolderType;
            _this.selectedMsgDetails = null;
            // Load the messages
            _this.getMessagesForTheSelectedTab();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Re render the component
         */
        this.onReRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This method will return the QIG items list
         */
        this.getQigItemsList = function () {
            _this.qigListItems = new Array();
            var msg = messageStore.instance.messagesMarkSchemes;
            if (msg) {
                msg.forEach(function (message) {
                    var item = {
                        name: stringFormatHelper.formatAwardingBodyQIG(message.markSchemeGroupName, message.assessmentCode, message.sessionName, message.componentId, message.questionPaperName, message.assessmentName, message.componentName, stringFormatHelper.getOverviewQIGNameFormat()),
                        id: message.markSchemeGroupId,
                        parentExaminerDisplayName: _this.formattedExaminerName(message.parentInitials, message.parentSurname),
                        parentExaminerId: message.parentExaminerId,
                        questionPaperPartId: message.questionPaperPartId,
                        examinerRoleId: message.examinerRoleId,
                        approvalStatusId: message.approvalStatusId,
                        coordinationComplete: message.coordinationComplete
                    };
                    _this.qigListItems.push(item);
                });
            }
            return _this.qigListItems.sort(function (obj1, obj2) {
                return obj1.name.localeCompare(obj2.name);
            });
        };
        /**
         * This method will return the selected QIG details
         */
        this.getSelectedQigDetails = function () {
            // If an examiner has only one qig to be selected from the list. Display that list
            if (_this.qigListItems.length === 1) {
                _this.getSupervisorAndQIGDetails(_this.qigListItems[0].id);
            }
            else {
                _this.selectedQigItemId = 0;
                _this.selectedQigName = localeStore.instance.TranslateText('messaging.compose-message.select-qig-placeholder');
                _this.supervisorName = '';
                _this.supervisorId = 0;
            }
        };
        /**
         * Callback function for QIG dropdown select action
         */
        this.onQigItemSelected = function (selectedItem) {
            _this.getSupervisorAndQIGDetails(selectedItem);
            _this.setState({ renderedOn: Date.now() });
        };
        this.resetMessagePopup = function (navigateTo) {
            if (_this.selectedMsg !== undefined && _this.selectedMsg.status === enums.MessageReadStatus.New) {
                _this.messageGroupDetails = messageHelper.getGroupedMessageObject(_this.filteredMessages, _this.expandOrCollapseDetails);
                _this.updateNotification();
            }
            switch (navigateTo) {
                case enums.SaveAndNavigate.newMessageButtonClick:
                    _this.resetvariables();
                    // fill qig items
                    _this.getQigItemsList();
                    // reset the selected item
                    _this.getSelectedQigDetails();
                    messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.InboxCompose);
                    break;
                case enums.SaveAndNavigate.toReplyMessage:
                    _this.setvariablesforReplyForward(enums.MessageAction.Reply);
                    break;
                case enums.SaveAndNavigate.toForwardMessage:
                    _this.setvariablesforReplyForward(enums.MessageAction.Forward);
                    break;
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Callback function for message menu action click
         * @param messageMenuActionType
         */
        this.onMessageMenuActionClick = function (messageMenuActionType) {
            _this.messageGroupDetails = messageHelper.getGroupedMessageObject(_this.filteredMessages, _this.expandOrCollapseDetails);
            _this.updateNotification();
            if (messageMenuActionType === enums.MessageAction.Delete) {
                _this.showDeleteMessagePopUp();
            }
            if (!messageStore.instance.isMessagePanelActive && messageMenuActionType !== enums.MessageAction.Delete) {
                _this.isReplyOrForwardClicked = true;
                _this.setvariablesforReplyForward(messageMenuActionType);
            }
            else {
                var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
                if (messageMenuActionType === enums.MessageAction.Reply) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toReplyMessage);
                }
                else if (messageMenuActionType === enums.MessageAction.Forward) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toForwardMessage);
                }
                _this.isReplyOrForwardClicked = true;
            }
        };
        /**
         * This method will return the supervisor details against a qig
         */
        this.getSupervisorAndQIGDetails = function (qigId) {
            var item = _this.qigListItems.filter(function (x) { return x.id === qigId; })[0];
            if (item) {
                _this.selectedQigItemId = item.id;
                _this.selectedQigName = item.name;
                _this.supervisorName = item.parentExaminerDisplayName;
                _this.supervisorId = item.parentExaminerId;
                _this.selectedQuestionPaperPartId = item.questionPaperPartId;
            }
        };
        /**
         * Reset private variables
         */
        this.resetvariables = function () {
            _this.currentMessageType = enums.MessageType.InboxCompose;
            _this.responseId = undefined;
            _this.subject = '';
            _this.selectedQigName = '';
            _this.supervisorId = 0;
            _this.supervisorName = '';
            _this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
            _this.selectedQigItemId = undefined;
            _this.messageBody = '';
            _this.isReplyOrForwardClicked = false;
        };
        /**
         * This method will set variables for Reply and Forward
         */
        this.doSetvariablesforReplyForward = function (messageMenuActionType) {
            _this.isMessagePopupVisible = true;
            _this.getSupervisorAndQIGDetails(_this.selectedMsg.markSchemeGroupId);
            _this.responseId = _this.selectedMsgDetails.displayId;
            _this.priorityDropdownSelectedItem = messageHelper.getPriorityDropDownSelectedItem(_this.selectedMsg.priorityName);
            var translatedMessageContents = messageTranslationHelper.getTranslatedContent(_this.selectedMsg);
            var messageBody;
            // If selected message is a system message then set the corresponding language json file entry
            if (_this.selectedMsg.examBodyMessageTypeId != null && _this.selectedMsg.examBodyMessageTypeId !== enums.SystemMessage.None) {
                messageBody = translatedMessageContents.content;
            }
            else {
                messageBody = _this.selectedMsgDetails.body;
            }
            switch (messageMenuActionType) {
                case enums.MessageAction.Reply:
                    _this.currentMessageType = enums.MessageType.InboxReply;
                    _this.supervisorId = _this.selectedMsg.fromExaminerId;
                    _this.supervisorName = _this.selectedMsg.examinerDetails.fullName;
                    _this.subject = messageHelper.getSubjectContent(enums.MessageType.InboxReply, translatedMessageContents.subject);
                    _this.messageBody = messageHelper.getMessageContent(enums.MessageType.InboxReply, _this.selectedMsg.examinerDetails.fullName, _this.selectedMsg.displayDate, messageBody);
                    _this.selectedQigItemId = _this.selectedMsg.markSchemeGroupId;
                    messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.InboxReply);
                    break;
                case enums.MessageAction.Forward:
                    _this.currentMessageType = enums.MessageType.InboxForward;
                    var selectedQigItem = _this.getQigItemsList().filter(function (x) { return x.id === _this.selectedQigItemId; });
                    var qigId = _this.selectedQigItemId;
                    var examinerRoleId = selectedQigItem[0].examinerRoleId;
                    var args = {
                        examinerRoleId: examinerRoleId,
                        qigId: qigId
                    };
                    messagingActionCreator.getTeamDetails(args);
                    _this.subject = messageHelper.getSubjectContent(enums.MessageType.InboxForward, translatedMessageContents.subject);
                    _this.messageBody = messageHelper.getMessageContent(enums.MessageType.InboxForward, _this.selectedMsg.examinerDetails.fullName, _this.selectedMsg.displayDate, messageBody);
                    _this.priorityDropdownSelectedItem = messageHelper.getPriorityDropDownSelectedItem(_this.selectedMsg.priorityName);
                    messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.InboxForward);
                    break;
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Will display delete message confirmation dialog
         */
        this.showDeleteMessagePopUp = function () {
            _this.updateNotification();
            // display dialog box
            _this.setState({ isDeleteMessagePopupVisible: true });
        };
        /**
         * Delete message confirmation dialog Yes click
         */
        this.onYesButtonDeleteMessageClick = function () {
            _this.deleteMessage();
            // hiding confirmation dialog
            _this.setState({ isDeleteMessagePopupVisible: false });
        };
        /**
         * Delete message confirmation dialog No click
         */
        this.onNoButtonDeleteMessageClick = function () {
            // hiding confirmation dialog
            _this.setState({ isDeleteMessagePopupVisible: false });
        };
        /**
         * Update the message deleted Status to database
         */
        this.updateMessageDeletedStatus = function () {
            var messages = _this.messageGroupDetails.messages;
            // Scenario 1. After a deleting a message, Check any other message exists just next to the current QIG, If So Select that item
            // Find All messages related to the the Selected message
            var messagesInTheSelectedQigs = immutable.List(messages.filter(function (x) { return x.markSchemeGroupId === _this.selectedMsg.markSchemeGroupId; }));
            // Find the message index with in the selected QIG messages
            var selectedMessageIndexInTheQIG = messagesInTheSelectedQigs.findIndex(function (x) { return x.examinerMessageId === _this.selectedMsg.examinerMessageId; });
            // Check currently selected message is the last item in the QIG Group.
            if (selectedMessageIndexInTheQIG === messagesInTheSelectedQigs.count() - 1) {
                // Select Previous message in the same group, If it has a previous item in the message
                if (messagesInTheSelectedQigs.count() > 1) {
                    _this.selectedMsg = messagesInTheSelectedQigs.get(selectedMessageIndexInTheQIG - 1);
                }
                else {
                    //  Select the next Item In the all messages, If it is Not the last messages in the Panel.
                    var selectedMessageIndexInAllMessages = messages.findIndex(function (x) { return x.examinerMessageId === _this.selectedMsg.examinerMessageId; });
                    if (selectedMessageIndexInAllMessages !== messages.count() - 1) {
                        _this.selectedMsg = messages.get(selectedMessageIndexInAllMessages + 1);
                    }
                    else if (messages.count() > 1) {
                        // If it is laste message in all messages and has a previous message select.
                        _this.selectedMsg = messages.get(selectedMessageIndexInAllMessages - 1);
                    }
                    else {
                        // All deleted.
                        _this.selectedMsg = undefined;
                    }
                }
            }
            else {
                // Message Deleted In a QIG group and has a next message with in  the Group, Select Next Message in the Selected QIG Group.
                _this.selectedMsg = messagesInTheSelectedQigs.get(selectedMessageIndexInTheQIG + 1);
            }
            _this.selectedMsgDetails = null;
            // refresh the data
            _this.getMessagesForInboxOnDeletion();
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Open the response page.
         */
        this.navigateToResponsePage = function () {
            navigationHelper.loadResponsePage();
        };
        /**
         * Show Loading Indicator.
         */
        this.onDisplayIdClick = function () {
            var messageNavigationArguments = {
                responseId: null,
                canNavigate: true,
                navigateTo: enums.MessageNavigation.toSearchedResponse,
                navigationConfirmed: false,
                hasMessageContainsDirtyValue: undefined,
                triggerPoint: enums.TriggerPoint.None
            };
            if (messageStore.instance.isMessagePanelActive) {
                messageNavigationArguments.canNavigate = false;
                messagingActionCreator.canMessageNavigate(messageNavigationArguments);
            }
            else {
                _this.openSearchedResponse(messageNavigationArguments);
            }
        };
        /**
         * Update the message count
         */
        this.updateNotification = function () {
            _this.unreadMessageCount = messageStore.instance.getUnreadMessageCount;
        };
        this.openSearchedResponse = function (messageNavigationArguments) {
            if (messageNavigationArguments.canNavigate &&
                messageNavigationArguments.navigateTo === enums.MessageNavigation.toSearchedResponse) {
                responseActionCreator.getResponseDetails(_this.selectedMsgDetails.displayId, _this.selectedMsgDetails.markGroupId, _this.selectedMsgDetails.esMarkGroupId, _this.selectedMsg.markSchemeGroupId, _this.selectedMsg.examinerMessageId, _this.selectedMsgDetails.candidateScriptId, loginSession.EXAMINER_ID, _this.selectedMsgDetails.isElectronicStandardisationTeamMember, _this.selectedMsgDetails.isTeamManagement);
                _this.setState({ isOpeningResponse: true });
            }
        };
        /**
         * Data Received For Opening the response. Validate marker is withdrwan from the QIG
         */
        this.initiateSerachResponse = function (searchedResponseData) {
            _this.searchedResponseData = searchedResponseData;
            if (searchedResponseData.approvalStatusId === enums.ExaminerApproval.Withdrawn) {
                _this.setState({ isOpeningResponse: false });
                _this.getMessagesForTheSelectedTab();
                _this.selectedMsg = undefined;
                _this.selectedMsgDetails = null;
                return;
            }
            else if (searchedResponseData.hasQualityFeedbackOutstanding &&
                searchedResponseData.loggedInExaminerId === searchedResponseData.examinerId) {
                // Display Message for indicating the Quality feedback message
                _this.setState({ isOpeningResponse: false, hasOpeningQualityFeedbackQutstandingQIGsResponse: true });
                return;
            }
            responseSearchHelper.initiateSerachResponse(searchedResponseData);
        };
        /**
         * Close the Quality feedback message.
         */
        this.onQualityFeedbackWarningMessageClose = function () {
            _this.setState({ hasOpeningQualityFeedbackQutstandingQIGsResponse: false });
        };
        /**
         * We've to clear the existing search filter if the user is navigating to menu.
         */
        this.onMenuOpen = function (doVisible) {
            if (doVisible === void 0) { doVisible = true; }
            _this.expandOrCollapseDetails = undefined;
            if (doVisible && _this.searchData.searchText !== '') {
                _this.onSearch('');
            }
            _this.onMessagesReceived(0);
        };
        /**
         * Callback function function for on search
         */
        this.onSearch = function (searchText) {
            _this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
            _this.selectedMsg = undefined;
            _this.onMessagesReceived(0);
        };
        /**
         * Update the collection with expand or collapse details
         * @param qigId number
         * @param isOpen boolean
         */
        this.onExpandOrCollapse = function (qigId, isOpen) {
            // Dictionary already contains the key then update the value otherwise add a new entry.
            _this.expandOrCollapseDetails = _this.expandOrCollapseDetails.set(qigId, isOpen);
            _this.onMessagesReceived(0);
        };
        /**
         * hide busy indicator on response search failed
         */
        this.onResponseDataReceivedFailed = function () {
            _this.setState({ isOpeningResponse: false });
        };
        // Handles the action event on Message Details Received failed
        this.onMessageDetailsReceivedFailed = function () {
            _this.isLoadingDataFailed = true;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Actions to be done when online status updated
         */
        this.onOnlineStatusUpdated = function () {
            //DefectFix #65417: Removed offline check, since on offline, the offline message is showing without any user action
            if (applicationStore.instance.isOnline) {
                // if in online mode, the proceed the action
                switch (_this.messageType) {
                    case enums.MessageType.InboxCompose:
                        _this.onNewMessageClicked();
                        break;
                    case enums.MessageType.InboxForward:
                        _this.doSetvariablesforReplyForward(enums.MessageAction.Forward);
                        break;
                    case enums.MessageType.InboxReply:
                        _this.doSetvariablesforReplyForward(enums.MessageAction.Reply);
                        break;
                }
                /*If the application goes offline when clicking a response from inbox and then comes back online
                loading response indicator will be shown and no response will be loaded, so setting loading
                indicator to false when back online*/
                if (_this.state.isOpeningResponse === true) {
                    _this.setState({ isOpeningResponse: false });
                }
                _this.messageType = enums.MessageType.None;
            }
        };
        // If page is refreshed, redirect to login page. // This will clear the memory.
        if (!loginSession.IS_AUTHENTICATED) {
            navigationHelper.loadLoginPage();
            window.location.replace(config.general.SERVICE_BASE_URL);
            return;
        }
        this.logoutConfirmation = this.showLogoutConfirmation.bind(this, true);
        this.resetLogoutConfirmationSatus = this.showLogoutConfirmation.bind(this, false);
        /* binding the parent(current) context to showLogoutConfirmation which is passed as prop to child and executing inside child */
        /* setting submit confirmation yes/no functions to initialize. */
        this.state = {
            modulesLoaded: false,
            isLogoutConfirmationPopupDisplaying: false,
            isDefaultTabActive: true,
            isOpeningResponse: false,
            hasOpeningQualityFeedbackQutstandingQIGsResponse: false
        };
        this.selectedTab = enums.MessageFolderType.Inbox;
        this.onMessageClick = this.onMessageClick.bind(this);
        this.showDeleteMessagePopUp = this.showDeleteMessagePopUp.bind(this);
        this.onTabSelected = this.onTabSelected.bind(this);
        this.onQualityFeedbackWarningMessageClose = this.onQualityFeedbackWarningMessageClose.bind(this);
        this.onMessageDetailsReceivedFailed = this.onMessageDetailsReceivedFailed.bind(this);
    }
    /**
     * Render Method to display the data.
     */
    MessageContainer.prototype.render = function () {
        var footer = (React.createElement(Footer, {id: this.props.id, key: 'key_' + this.props.id, selectedLanguage: this.props.selectedLanguage, footerType: enums.FooterType.Message, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationSatus}));
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'modules_loading_indicator', isBusy: true, key: 'response_loading_indicator', isMarkingBusy: false, busyIndicatorInvoker: enums.BusyIndicatorInvoker.loadingModules, showBackgroundScreen: false, doShowDialog: !this.state.modulesLoaded || !this.state.scriptLoaded}));
        if (this.state.modulesLoaded && this.state.scriptLoaded) {
            var header = React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, containerPage: enums.PageContainers.Message, unReadMessageCount: this.unreadMessageCount});
            var nonRecoverableErrorMessage = (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('messaging.message-lists.quality-feedback-pending-dialog.body'), header: localeStore.instance.TranslateText('home.qig-statuses.QualityFeedback'), displayPopup: this.state.hasOpeningQualityFeedbackQutstandingQIGsResponse, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onQualityFeedbackWarningMessageClose, id: 'nonRecoverableErrorMessge', key: 'marksAndAnnotationsErrorMessge', popupDialogType: enums.PopupDialogType.QualityFeedbackWarning}));
            var deleteMessage = (React.createElement(ConfirmationDialog, {content: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.body'), header: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.header'), displayPopup: this.state.isDeleteMessagePopupVisible, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.yes-button'), onYesClick: this.onYesButtonDeleteMessageClick, onNoClick: this.onNoButtonDeleteMessageClick, dialogType: enums.PopupDialogType.MbCReturnToWorklistConfirmation, isKeyBoardSupportEnabled: true}));
            return (React.createElement("div", {className: classNames('message-wrapper', { 'loading': this.selectedMsg && this.state.isOpeningResponse })}, this.renderLoadingIndicator(), header, React.createElement("div", {className: 'content-wrapper relative'}, React.createElement(MessagePopup, {isOpen: this.isMessagePopupVisible, closeMessagePanel: this.onCloseMessagePopup, messageType: this.currentMessageType, onResetPopupCallback: this.resetMessagePopup, responseId: this.responseId, selectedLanguage: this.props.selectedLanguage, qigItemsList: this.qigListItems, selectedQigItemId: this.selectedQigItemId, selectedQigItem: this.selectedQigName, supervisorId: this.supervisorId, supervisorName: this.supervisorName, subject: this.subject, priorityDropDownSelectedItem: this.priorityDropdownSelectedItem, onQigItemSelected: this.onQigItemSelected, messageBody: this.messageBody, questionPaperPartId: this.selectedQuestionPaperPartId, selectedMessage: this.selectedMsg, selectedMsgDetails: this.selectedMsgDetails, isReplyOrForwardClicked: this.isReplyOrForwardClicked}), React.createElement("div", {className: 'tab-holder horizontal msg-tab'}, React.createElement("div", {className: 'msg-tab-header'}, React.createElement("div", {className: 'col-wrap'}, React.createElement("div", {className: 'col-9-of-12 msg-tabs-nav'}, React.createElement("ul", {className: 'tab-nav padding-left-10', role: 'tablist'}, React.createElement(MessageTabItem, {messageFolderType: enums.MessageFolderType.Inbox, isSelected: this.selectedTab === enums.MessageFolderType.Inbox, onTabSelected: this.onTabSelected, unReadMessageCount: messageStore.instance.getUnreadMessageCount}), React.createElement(MessageTabItem, {messageFolderType: enums.MessageFolderType.Sent, isSelected: this.selectedTab === enums.MessageFolderType.Sent, onTabSelected: this.onTabSelected, unReadMessageCount: 0}), React.createElement(MessageTabItem, {messageFolderType: enums.MessageFolderType.Deleted, isSelected: this.selectedTab === enums.MessageFolderType.Deleted, onTabSelected: this.onTabSelected, unReadMessageCount: 0}))), React.createElement("div", {className: 'col-3-of-12 text-right compose-msg-btn-wrap'}, React.createElement(GenericButton, {id: 'new_message_btn', key: 'key_new_message_btn', className: 'button primary rounded', title: localeStore.instance.TranslateText('messaging.message-lists.top-panel.new-message-button'), content: localeStore.instance.TranslateText('messaging.message-lists.top-panel.new-message-button'), disabled: false, onClick: this.onNewMessageClick})))), React.createElement(MessageLeftPanel, {selectedLanguage: this.props.selectedLanguage, selectedTab: this.selectedTab, messages: this.messageGroupDetails, onSearch: this.onSearch, searchData: this.searchData, selectedMsg: this.selectedMsg, onSelectedMessageChanged: this.onMessageClick, messageGroupDetails: this.messageGroupDetails, onExpandOrCollapse: this.onExpandOrCollapse}), React.createElement(MessageRightPanel, {selectedLanguage: this.props.selectedLanguage, message: this.selectedMsg, messageDetails: this.selectedMsgDetails, selectedTab: this.selectedTab, isForwardButtonHidden: this.isForwardButtonHidden(this.selectedMsg ? this.selectedMsg.markSchemeGroupId : 0), onMessageMenuActionClickCallback: this.onMessageMenuActionClick, onDisplayIdClick: this.onDisplayIdClick}))), deleteMessage, nonRecoverableErrorMessage, footer));
        }
        else {
            return (React.createElement("div", null, busyIndicator, footer));
        }
    };
    /**
     * Render Loading Indicator
     */
    MessageContainer.prototype.renderLoadingIndicator = function () {
        if (!this.forceDisableLoading &&
            (this.messageGroupDetails === undefined ||
                this.messageGroupDetails.messages === undefined ||
                (this.messageGroupDetails.messages.count() > 0 &&
                    (this.selectedMsgDetails === null || this.state.isOpeningResponse)))) {
            var loadingTextKey = this.state.isOpeningResponse ? 'loadResponseInMessage' : 'loadingModules';
            return (React.createElement("div", {className: 'message-loader vertical-middle loading'}, React.createElement("span", {className: 'loader middle-content'}, React.createElement("span", {className: 'dot'}), " ", React.createElement("span", {className: 'dot'}), " ", React.createElement("span", {className: 'dot'}), React.createElement("div", {className: 'loading-text padding-top-30'}, localeStore.instance.TranslateText('generic.busy-indicator.' + loadingTextKey)))));
        }
    };
    /**
     * This method will call when composing new message while system is in online mode
     */
    MessageContainer.prototype.onNewMessageClicked = function () {
        var _this = this;
        if (!messageStore.instance.isMessagePanelActive) {
            this.resetMessagePopup(enums.SaveAndNavigate.newMessageButtonClick);
            this.isMessagePopupVisible = true;
            if (this.selectedQigItemId && this.selectedQigItemId !== 0) {
                var selectedQigItem = this.qigListItems.filter(function (x) { return x.id === _this.selectedQigItemId; });
                if (selectedQigItem && selectedQigItem.length > 0) {
                    var qigId = this.selectedQigItemId;
                    var examinerRoleId = selectedQigItem[0].examinerRoleId;
                    var args = {
                        examinerRoleId: examinerRoleId,
                        qigId: qigId
                    };
                    messagingActionCreator.getTeamDetails(args);
                }
            }
            this.setState({ renderedOn: Date.now() });
        }
        else {
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.newMessageButtonClick);
        }
    };
    /**
     * Get the Messages for the selected tab
     */
    MessageContainer.prototype.getMessagesForTheSelectedTab = function () {
        var canRefresh = this.selectedTab === enums.MessageFolderType.Deleted ? messageStore.instance.isMessageDeleted() : false;
        canRefresh = (this.selectedTab === enums.MessageFolderType.Inbox) || (this.selectedTab === enums.MessageFolderType.Sent) ?
            messageStore.instance.isMessageDataRequireUpdation : canRefresh;
        var args = {
            recentMessageTime: null,
            messageFolderType: this.selectedTab,
            forceLoadMessages: (canRefresh
                || messageStore.instance.isNewExaminerRoleCreated
                || messageStore.instance.isUnreadMandatoryMessagePresent)
        };
        messagingActionCreator.getMessages(args);
    };
    /**
     *  Get the Messages for the selected tab
     */
    MessageContainer.prototype.getMessagesForInboxOnDeletion = function () {
        var args = {
            recentMessageTime: null,
            messageFolderType: enums.MessageFolderType.Inbox,
            forceLoadMessages: messageStore.instance.isMessageDataRequireUpdation
        };
        messagingActionCreator.getMessages(args);
    };
    /**
     * Redirect to the start page if not authenticated
     */
    MessageContainer.prototype.componentWillMount = function () {
        if (!loginSession.IS_AUTHENTICATED) {
            navigationHelper.loadLoginPage();
        }
    };
    /**
     * Comparing the props to check the updats are made by self
     * @param nextProps
     */
    MessageContainer.prototype.componentWillReceiveProps = function (nextProps) {
        // If current online status if offline
        // and application is getting online now, then if we have already a loading indicator
        // visible before the application goes offline then remvoe the loading indicator.
        if (!this.props.isOnline && nextProps.isOnline) {
            this.isLoadingDataFailed = true;
        }
    };
    /**
     * Method to load dependencies
     */
    MessageContainer.prototype.dependenciesLoaded = function () {
        this.setState({ scriptLoaded: true });
    };
    /**
     * load the modules required for MessageContainer
     */
    MessageContainer.prototype.componentDidMount = function () {
        if (this.state == null) {
            return;
        }
        this.loadDependenciesAndEventListeners();
    };
    /**
     * load the modules required for MessageContainer
     */
    MessageContainer.prototype.componentDidUpdate = function () {
        // This will reset the failed data only in online to
        // prevent loading indicator spinning inifinte time
        if (this.props.isOnline) {
            this.isLoadingDataFailed = false;
        }
    };
    /**
     * Component will unmount
     */
    MessageContainer.prototype.componentWillUnmount = function () {
        if (this.state == null || !this.state.modulesLoaded) {
            return;
        }
        this.removeEventListeners();
        messageHelper.removeInitMouseClickEventScriptBlock();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    MessageContainer.prototype.loadDependenciesAndEventListeners = function () {
        var _this = this;
        var ensurePromise = require.ensure(['../utility/navigation/navigationhelper',
            './notificationcount',
            './messageleftpanel', './messagerightpanel',
            './messagetabitem', '../../stores/message/messagestore',
            '../../stores/configurablecharacteristics/configurablecharacteristicsstore', './messagepopup',
            '../../actions/messaging/messagingactioncreator', '../utility/genericbutton', '../../utility/stringformat/stringformathelper',
            '../utility/message/messagehelper',
            '../header',
            '../../actions/popupdisplay/popupdisplayactioncreator',
            '../utility/popup/popuphelper',
            '../../utility/markscheme/markinghelper', '../utility/confirmationdialog',
            '../../utility/responsesearch/responsesearchhelper',
            '../../stores/response/responsestore',
            '../../actions/response/responseactioncreator', '../utility/message/messagetranslationhelper',
            '../utility/genericdialog', '../../stores/navigation/navigationstore', '../../actions/userinfo/userinfoactioncreator',
            '../../stores/qigselector/qigstore', '../../stores/userinfo/userinfostore', '../../utility/generic/htmlutilities',
            '../../dataservices/base/urls'], function () {
            navigationHelper = require('../utility/navigation/navigationhelper');
            notificationCount = require('./notificationcount');
            MessageLeftPanel = require('./messageleftpanel');
            MessageRightPanel = require('./messagerightpanel');
            MessageTabItem = require('./messagetabitem');
            messageStore = require('../../stores/message/messagestore');
            ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
            localeStore = require('../../stores/locale/localestore');
            MessagePopup = require('./messagepopup');
            messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
            GenericButton = require('../utility/genericbutton');
            stringFormatHelper = require('../../utility/stringformat/stringformathelper');
            messageHelper = require('../utility/message/messagehelper');
            Header = require('../header');
            popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
            popupHelper = require('../utility/popup/popuphelper');
            markingHelper = require('../../utility/markscheme/markinghelper');
            ConfirmationDialog = require('../utility/confirmationdialog');
            responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
            responseStore = require('../../stores/response/responsestore');
            responseActionCreator = require('../../actions/response/responseactioncreator');
            messageTranslationHelper = require('../utility/message/messagetranslationhelper');
            GenericDialog = require('../utility/genericdialog');
            navigationStore = require('../../stores/navigation/navigationstore');
            userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
            qigStore = require('../../stores/qigselector/qigstore');
            userInfoStore = require('../../stores/userinfo/userinfostore');
            htmlUtilities = require('../../utility/generic/htmlutilities');
            urls = require('../../dataservices/base/urls');
            // Message container, leaves the operation mode. Reset the operations mode.
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
            // Load the messages
            this.getMessagesForTheSelectedTab();
            // fill qig items
            this.getQigItemsList();
            // reset the selected item
            this.getSelectedQigDetails();
            this.loadTinyMCE();
            messageHelper.addInitMouseClickEventScriptBlock();
            this.addEventListeners();
            this.setState({ modulesLoaded: true });
            // hook all event listeners.
        }.bind(this));
        ensurePromise.catch(function (e) {
            _this.props.setOfflineContainer(true, true);
        });
    };
    /**
     * Load Tyny MCE
     *
     * @private
     * @memberof MessageContainer
     */
    MessageContainer.prototype.loadTinyMCE = function () {
        var url = htmlUtilities.getFullUrl(urls.TINYMCE_URL);
        // If tinyMCE script is not loaded then load that
        if (!htmlUtilities.isScriptLoaded(url)) {
            var script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = (this.dependenciesLoaded.bind(this));
            document.body.appendChild(script);
        }
        else {
            this.dependenciesLoaded();
        }
    };
    /**
     * Method to add event listeners
     */
    MessageContainer.prototype.addEventListeners = function () {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_RECEIVED, this.onMessagesReceived);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onReRender);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onReRender);
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.onCloseMessagePopup);
        messageStore.instance.addListener(messageStore.MessageStore.REFRESH_MESSAGE_TAB, this.onRefreshMessageTab);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.navigateToResponsePage);
        responseSearchHelper.addResponseSearchEvents();
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.updateNotification);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.openSearchedResponse);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT, this.initiateSerachResponse);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.logoutConfirmation);
        navigationStore.instance.addListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.onMenuOpen);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT, this.onResponseDataReceivedFailed);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED, this.onMessageDetailsReceivedFailed);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusUpdated);
    };
    /**
     * Method to remove event listeners
     */
    MessageContainer.prototype.removeEventListeners = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_RECEIVED, this.onMessagesReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onReRender);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onReRender);
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.onCloseMessagePopup);
        messageStore.instance.removeListener(messageStore.MessageStore.REFRESH_MESSAGE_TAB, this.onRefreshMessageTab);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.navigateToResponsePage);
        responseSearchHelper.removeResponseSearchEvents();
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.updateNotification);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.openSearchedResponse);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT, this.initiateSerachResponse);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.logoutConfirmation);
        navigationStore.instance.removeListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.onMenuOpen);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT, this.onResponseDataReceivedFailed);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED, this.onMessageDetailsReceivedFailed);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusUpdated);
    };
    /**
     * Method to redirect to worklist page on clicking button
     */
    MessageContainer.prototype.renderWorkListPage = function () {
        navigationHelper.navigateToWorklist();
    };
    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    MessageContainer.prototype.showLogoutConfirmation = function (logout) {
        this.setState({ isLogoutConfirmationPopupDisplaying: logout });
    };
    /**
     * Update the Read Status to database
     * @param message : message to update the read status
     */
    MessageContainer.prototype.updateReadStatus = function (message) {
        // If the message is currently in un read status and also make sure it is not made as read already
        if (message &&
            (message.status === enums.MessageReadStatus.New
                && !messageStore.instance.isMessageRead(message.examinerMessageId))) {
            var examinerList = [];
            examinerList[0] = 0;
            var args = {
                messageId: message.examinerMessageId,
                messageDistributionIds: message.messageDistributionIds,
                examinerMessageStatusId: enums.MessageReadStatus.Read
            };
            // action for updating read status for the newly selected response.
            messagingActionCreator.updateMessageStatus(args);
        }
    };
    /**
     * This will returns the formatted the examiner name
     */
    MessageContainer.prototype.formattedExaminerName = function (parentInitials, parentSurname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', parentInitials);
        formattedString = formattedString.replace('{surname}', parentSurname);
        return formattedString;
    };
    /**
     * invoke when select reply/forward message action
     * @param messageMenuActionType
     */
    MessageContainer.prototype.setvariablesforReplyForward = function (messageMenuActionType) {
        // check online status before proceed
        switch (messageMenuActionType) {
            case enums.MessageAction.Forward:
                this.checkOnlineStatusAndDoMessageAction(enums.MessageType.InboxForward);
                break;
            case enums.MessageAction.Reply:
                this.checkOnlineStatusAndDoMessageAction(enums.MessageType.InboxReply);
                break;
        }
    };
    /**
     * Delete the selected message - updating database
     */
    MessageContainer.prototype.deleteMessage = function () {
        if (this.selectedMsg) {
            var examinerList = [];
            examinerList[0] = 0;
            var args = {
                messageId: this.selectedMsg.examinerMessageId,
                messageDistributionIds: this.selectedMsg.messageDistributionIds,
                examinerMessageStatusId: enums.MessageReadStatus.Closed
            };
            // action for updating read status for the newly selected response.
            messagingActionCreator.updateMessageStatus(args);
        }
    };
    /**
     * returns whether the forward button is hidden or not
     * @param markSchemeGroupId
     */
    MessageContainer.prototype.isForwardButtonHidden = function (markSchemeGroupId) {
        var item = this.qigListItems.filter(function (x) { return x.id === markSchemeGroupId; })[0];
        if (item === undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    Object.defineProperty(MessageContainer.prototype, "expandOrCollapseDetails", {
        /**
         * Returns expand or collapse object based on selected tab
         */
        get: function () {
            switch (this.selectedTab) {
                case enums.MessageFolderType.Sent:
                    if (!this.sentTabExpandOrCollapseDetails) {
                        this.sentTabExpandOrCollapseDetails = immutable.Map();
                    }
                    return this.sentTabExpandOrCollapseDetails;
                case enums.MessageFolderType.Deleted:
                    if (!this.deletedTabExpandOrCollapseDetails) {
                        this.deletedTabExpandOrCollapseDetails = immutable.Map();
                    }
                    return this.deletedTabExpandOrCollapseDetails;
                default:
                    if (!this.inboxTabExpandOrCollapseDetails) {
                        this.inboxTabExpandOrCollapseDetails = immutable.Map();
                    }
                    return this.inboxTabExpandOrCollapseDetails;
            }
        },
        /**
         * set expand or collapse object based on selected tab
         */
        set: function (expandOrCollapseDetails) {
            if (expandOrCollapseDetails === undefined) {
                this.sentTabExpandOrCollapseDetails = undefined;
                this.deletedTabExpandOrCollapseDetails = undefined;
                this.inboxTabExpandOrCollapseDetails = undefined;
            }
            switch (this.selectedTab) {
                case enums.MessageFolderType.Sent:
                    this.sentTabExpandOrCollapseDetails = expandOrCollapseDetails;
                    break;
                case enums.MessageFolderType.Deleted:
                    this.deletedTabExpandOrCollapseDetails = expandOrCollapseDetails;
                    break;
                default:
                    this.inboxTabExpandOrCollapseDetails = expandOrCollapseDetails;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageContainer.prototype, "filteredMessages", {
        /**
         * Returns the filtered set of messages if filter is applicable
         */
        get: function () {
            var _this = this;
            var filteredMessages = messageStore.instance.messages;
            if (this.searchData.searchText !== '' && this.searchData.isVisible) {
                filteredMessages = immutable.List(filteredMessages.filter(function (message) {
                    return messageTranslationHelper.getExaminerName(message).toLowerCase().indexOf(_this.searchData.searchText.toLowerCase()) !== -1;
                }));
            }
            return filteredMessages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageContainer.prototype, "forceDisableLoading", {
        // Disable loading indicator when application goes offline/
        // if it failed to retrienve data.
        get: function () {
            return this.isLoadingDataFailed || !this.props.isOnline;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * check online status
     * @param messageType
     */
    MessageContainer.prototype.checkOnlineStatusAndDoMessageAction = function (messageType) {
        /* Will request tinymce font when open a compose message panel first time
        (ie, when render message popup component first time). If open the compose message panel in offline mode,
        then the font request will get failed and thus the font family buttons are not visible.
        Since this request is happens only once, the font family buttons are not visible during that session.
        So we first do a ping and check the network status and if the system is in online,
        then proceed the message action (compose/reply/forward). If the system is in offline mode,
        then shows offline popup and don’t proceed the message action.*/
        if (applicationStore.instance.isOnline) {
            // ping and check online status if system is in online mode
            this.messageType = messageType;
            applicationActionCreator.validateNetWorkStatus(true);
        }
        else {
            // if in offline mode, then show offline popup
            applicationActionCreator.checkActionInterrupted();
        }
    };
    return MessageContainer;
}(pureRenderComponent));
module.exports = MessageContainer;
//# sourceMappingURL=messagecontainer.js.map