"use strict";
var messagestore = require('../../../stores/message/messagestore');
var groupHelper = require('../../../utility/grouping/grouphelper');
var grouperList = require('../../../utility/grouping/groupingbase/grouperlist');
var Immutable = require('immutable');
var enums = require('../enums');
var localehelper = require('../../../utility/locale/localehelper');
var stringFormatHelper = require('../../../utility/stringformat/stringformathelper');
var localeStore = require('../../../stores/locale/localestore');
var messageEditorConstants = require('../messageeditorconstants');
var stringHelper = require('../../../utility/generic/stringhelper');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var qigStore = require('../../../stores/qigselector/qigstore');
var MessageHelper = (function () {
    function MessageHelper() {
    }
    /**
     * Get the Header to display and the related messges
     * @param messages
     */
    MessageHelper.getGroupedMessageObject = function (messages, expandOrCollapseDetails) {
        var _this = this;
        // To store the messages after the grouping and sorting
        var messageList = Immutable.List();
        // Get the messages grouped by QIG
        var groupedMessages = groupHelper.group(messages, grouperList.MessageQigGrouper, enums.GroupByField.qig);
        // Get the key seq
        var groupedKeys = groupedMessages.keySeq();
        // Create the return object
        var returnObj = [];
        // Loop through the keys and find the list of messages for the group.
        groupedKeys.forEach(function (qigId) {
            // Get the messages for the group.
            var currentMessageGroup = groupedMessages.get(qigId);
            // Clear the collection, In each group.
            var messages = [];
            // Get the each messages for the group.
            currentMessageGroup.map(function (message) {
                if (message.status === enums.MessageReadStatus.New && messagestore.instance.isMessageRead(message.examinerMessageId)) {
                    message.status = enums.MessageReadStatus.Read;
                }
                messages.push(message);
            });
            // Get the awarding body name format
            var nameToDisplay = MessageHelper.getDisplayText(messages[0]);
            var messageFolderType = messages[0].messageFolderType;
            // Create an object to store messages
            var groupedObj = {
                qigId: parseInt(qigId),
                isOpen: _this.isQigOpen(parseInt(qigId), messageFolderType, expandOrCollapseDetails),
                textToDisplay: nameToDisplay,
                messages: messages,
                unReadMessages: messages.filter(function (x) {
                    return x.status === enums.MessageReadStatus.New && !messagestore.instance.isMessageRead(x.examinerMessageId);
                }).length
            };
            returnObj.push(groupedObj);
        });
        // Sort the objects based on the display header.
        var getGroupedMessageObject = returnObj.sort(function (obj1, obj2) {
            return obj1.textToDisplay.localeCompare(obj2.textToDisplay);
        });
        // Get the messages as in the order of displaying in the UI
        getGroupedMessageObject.forEach(function (messageObject) {
            messageList = Immutable.List(messageList.concat(messageObject.messages));
        });
        var messageGroupDetails = {
            // Stores the Grouped Object along with those messages
            MessageGroupObjects: getGroupedMessageObject,
            // Store all messages for the UI
            messages: messageList
        };
        return messageGroupDetails;
    };
    /**
     * Returns whether a particular qig is open or not
     * @param expandOrCollapseDetails
     */
    MessageHelper.isQigOpen = function (qigId, messageFolderType, expandOrCollapseDetails) {
        return expandOrCollapseDetails ? expandOrCollapseDetails.get(qigId, true) : true;
    };
    /**
     * Get the time style for the Date
     * @param timeToDisplay
     * @param todayTextConversionRequired : for deciding Today text conversion
     */
    MessageHelper.getDateToDisplay = function (timeToDisplay, todayTextConversionRequired) {
        if (todayTextConversionRequired === void 0) { todayTextConversionRequired = true; }
        var timeToDisplayDate = new Date(timeToDisplay);
        var todaysDate = new Date();
        var time = localehelper.toLocaleTimeString(new Date(timeToDisplay.toString()));
        // call setHours to take the time out of the comparison
        if ((timeToDisplayDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) && todayTextConversionRequired) {
            // Date equals today's date. Display date feild as Today.
            return localeStore.instance.TranslateText('messaging.message-lists.message-detail.date-today') + ' ' + time;
        }
        else {
            return localehelper.toLocaleDateString(new Date(timeToDisplay)) + ' ' + time;
        }
    };
    /**
     * Get the Display Header for the Group Header.
     * @param message
     */
    MessageHelper.getDisplayText = function (message) {
        var msg = messagestore.instance.messagesMarkSchemes;
        if (msg) {
            var messageList = msg.filter(function (messages) { return messages.markSchemeGroupId === message.markSchemeGroupId; });
            {
                return stringFormatHelper.formatAwardingBodyQIG(messageList.first().markSchemeGroupName, messageList.first().assessmentCode, messageList.first().sessionName, messageList.first().componentId, messageList.first().questionPaperName, messageList.first().assessmentName, messageList.first().componentName, stringFormatHelper.getOverviewQIGNameFormat());
            }
        }
    };
    /**
     * Return the Mark Scheme Group Name
     * @param message
     */
    MessageHelper.getMarkSchemeGroupName = function (message) {
        var msg = messagestore.instance.messagesMarkSchemes;
        if (msg) {
            return msg.filter(function (messages) { return messages.markSchemeGroupId === message.markSchemeGroupId; }).
                first().markSchemeGroupName;
        }
    };
    /**
     * Used to create the MessageOrExceptionLinkedItems based on the messages
     * @param messages
     */
    MessageHelper.getMessageLinkedItems = function (messages) {
        var messageOrExceptionLinkedItems = [];
        var items = messages.forEach(function (message) {
            messageOrExceptionLinkedItems.push({
                itemId: message.examinerMessageId,
                senderOrItem: message.toTeam ?
                    localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team') :
                    MessageHelper.appendExaminer(message),
                priorityOrStatus: message.priorityName,
                subjectOrType: message.subject,
                timeToDisplay: message.displayDate,
                isUnreadOrUnactioned: message.status === enums.MessageReadStatus.New &&
                    !messagestore.instance.isMessageRead(message.examinerMessageId)
            });
        });
        return Immutable.List(messageOrExceptionLinkedItems);
    };
    /**
     * append examiners
     */
    MessageHelper.appendExaminer = function (message) {
        var examiners = '';
        if (message && message.toExaminerDetails != null) {
            message.toExaminerDetails.map(function (item) {
                examiners += item.fullName + ';';
            });
            // removing last item semicolon
            return examiners.replace(/;$/, '');
        }
        else {
            examiners = message.examinerDetails.fullName;
        }
        return examiners;
    };
    /**
     * This method will returns the message content based on the template name
     * @param templateName - template name
     * @param messageBody - message content
     */
    MessageHelper.getMessageContent = function (templateName, messageFrom, date, messageBody) {
        var template;
        switch (templateName) {
            case enums.MessageType.InboxReply:
            case enums.MessageType.ResponseReply:
                template = stringHelper.format(localeStore.instance.TranslateText('messaging.compose-message.new-message-templates.reply'), [messageEditorConstants.TINYMCE_DEFAULT_FONT, messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE,
                    this.getDateToDisplay(date, false), messageFrom, messageBody]);
                break;
            case enums.MessageType.InboxForward:
            case enums.MessageType.ResponseForward:
                template = stringHelper.format(localeStore.instance.TranslateText('messaging.compose-message.new-message-templates.forward'), [messageEditorConstants.TINYMCE_DEFAULT_FONT, messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE,
                    this.getDateToDisplay(date, false), messageFrom, messageBody]);
                break;
            case enums.MessageType.ResponseCompose:
            case enums.MessageType.WorklistCompose:
            case enums.MessageType.InboxCompose:
            case enums.MessageType.TeamCompose:
                template = stringHelper.format(localeStore.instance.TranslateText('messaging.compose-message.new-message-templates.new'), [messageEditorConstants.TINYMCE_DEFAULT_FONT, messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE]);
                break;
        }
        return template;
    };
    /**
     * This method will return the Menu Action items needed based on the folder type
     * @param folderType
     * @param messageActions: an array of message actions
     */
    MessageHelper.getMessageMenuActionItems = function (folderType, messageActions) {
        var _this = this;
        var messageMenuActionItems = [];
        switch (folderType) {
            case enums.MessageFolderType.Inbox:
                if (messageActions && messageActions.length > 0) {
                    messageActions.map(function (x) {
                        var actionItems = _this.messageActionItems(x);
                        if (actionItems) {
                            messageMenuActionItems.push(actionItems);
                        }
                    });
                }
        }
        return messageMenuActionItems;
    };
    /**
     * This method will return the localised message string based on message type
     */
    MessageHelper.getMessageHeader = function (messageType) {
        var messageHeader;
        switch (messageType) {
            case enums.MessageType.InboxCompose:
            case enums.MessageType.WorklistCompose:
            case enums.MessageType.ResponseCompose:
            case enums.MessageType.TeamCompose:
                messageHeader = localeStore.instance.TranslateText('messaging.compose-message.new-message-header');
                break;
            case enums.MessageType.InboxForward:
            case enums.MessageType.ResponseForward:
                messageHeader = localeStore.instance.TranslateText('messaging.compose-message.forward-header');
                break;
            case enums.MessageType.InboxReply:
            case enums.MessageType.ResponseReply:
                messageHeader = localeStore.instance.TranslateText('messaging.compose-message.reply-header');
                break;
            case enums.MessageType.ResponseDetails:
                messageHeader = localeStore.instance.TranslateText('marking.response.message-panel.header');
        }
        return messageHeader;
    };
    /**
     * This method will returns the subject string
     * @param messageType
     * @param subject
     */
    MessageHelper.getSubjectContent = function (messageType, subject) {
        var subjectText;
        var subjectPrefix;
        switch (messageType) {
            case enums.MessageType.InboxCompose:
                subjectText = subject;
                break;
            case enums.MessageType.InboxForward:
            case enums.MessageType.ResponseForward:
                subjectPrefix = localeStore.instance.TranslateText('messaging.compose-message.forward-prefix');
                subjectText = subject.indexOf(subjectPrefix) === -1 ? subjectPrefix + ' ' + subject : subject;
                break;
            case enums.MessageType.InboxReply:
            case enums.MessageType.ResponseReply:
                subjectPrefix = localeStore.instance.TranslateText('messaging.compose-message.reply-prefix');
                subjectText = subject.indexOf(subjectPrefix) === -1 ? subjectPrefix + ' ' + subject : subject;
                break;
        }
        return subjectText;
    };
    Object.defineProperty(MessageHelper, "getCreateNewMessageText", {
        /**
         * Get the Create new text for the component.
         */
        get: function () {
            return localeStore.instance.TranslateText('marking.response.message-list-panel.create-new-message');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will return the Menu Action item based on the action parameter
     * @param messageAction
     */
    MessageHelper.messageActionItems = function (messageAction) {
        switch (messageAction) {
            case enums.MessageAction.Reply:
                return ({
                    id: enums.MessageAction.Reply,
                    icon: 'reply-icon',
                    name: localeStore.instance.TranslateText('messaging.message-lists.message-detail.reply-button')
                });
            case enums.MessageAction.Forward:
                if (!markerOperationModeFactory.operationMode.isForwardButtonHidden) {
                    return ({
                        id: enums.MessageAction.Forward,
                        icon: 'forward-icon',
                        name: localeStore.instance.TranslateText('messaging.message-lists.message-detail.forward-button')
                    });
                }
                break;
            case enums.MessageAction.Delete:
                return ({
                    id: enums.MessageAction.Delete,
                    icon: 'delete-icon-small',
                    name: localeStore.instance.TranslateText('messaging.message-lists.message-detail.delete-button')
                });
        }
    };
    /**
     * This method will update the IFrame content with message details
     * @param o
     * @param e
     */
    MessageHelper.addIFrameForMessageDetails = function (o, e) {
        var timeout = 0;
        // add script to init mouse click event in parent window for any 'click' in current window
        var scriptBlock = 'window.addEventListener(\'click\', function() { parent.initMouseClickEvent(); });';
        var headTagContent = '<style type="text/css"> p,body{margin:0;padding:0;}</style>';
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            //include script to block double tap and pinch zoom in iPad safari
            scriptBlock +=
                'window.addEventListener(\'touchend\', blockDoubleTapZoom);' +
                    'window.addEventListener(\'touchstart\', blockPinchToZoom);' +
                    //block double tap zoom
                    'let lastTap = 0;' +
                    'function blockDoubleTapZoom ( e ) {' +
                    'let currentTime = new Date().getTime();' +
                    'let tapLength = currentTime - lastTap;' +
                    'if (tapLength < 500 && tapLength > 0) {' +
                    'e.preventDefault();}' +
                    'lastTap = currentTime;' +
                    //init mouse click event
                    'parent.initMouseClickEvent(); }' +
                    //block pinch zoom
                    'function blockPinchToZoom ( e ) {' +
                    'if (e.touches.length > 1) {' +
                    'e.preventDefault();}' +
                    '}';
        }
        else {
            //incluse script to init mouse click event in parent window for any 'touch' in current window
            scriptBlock +=
                'window.addEventListener(\'touchend\', function() { parent.initMouseClickEvent(); });';
        }
        var content = e.getContent().trim() +
            '<script>' + scriptBlock + '</script >';
        // put a timeout of 0, otherwise message details are not rendering on first message item click
        if (!htmlUtilities.isTabletOrMobileDevice && htmlUtilities.getUserDevice().browser === 'Firefox') {
            timeout = 50;
        }
        setTimeout(function () {
            $('#msg-iframe_ifr').contents().find('head').html(headTagContent);
            $('#msg-iframe_ifr').contents().find('body').html(content);
        }, timeout);
    };
    /**
     * Returns a boolean indicating whether the message panel is edited.
     */
    MessageHelper.isMessagePanelEdited = function (messageType, messageToFieldValues, messageToFieldIds) {
        if (messagestore.instance.isMessagePanelActive) {
            var currentActiveEditorId = tinymce.activeEditor.id;
            var activeEditor = tinymce.get(MessageHelper.messageEditorId);
            if (messageType === enums.MessageType.InboxCompose || messageType === enums.MessageType.InboxForward ||
                messageType === enums.MessageType.InboxReply) {
                return MessageHelper.messageSubject && MessageHelper.messageSubject.trim().length > 0 ||
                    activeEditor.getContent({ format: 'text' }).trim().length > 0 ||
                    ((messageToFieldValues && messageToFieldValues.length > 0) &&
                        (messageToFieldIds && messageToFieldIds.length > 0));
            }
            else if (messageType === enums.MessageType.ResponseCompose
                || messageType === enums.MessageType.WorklistCompose || messageType === enums.MessageType.ResponseReply
                || messageType === enums.MessageType.ResponseForward || messageType === enums.MessageType.TeamCompose) {
                return MessageHelper.messageSubject && MessageHelper.messageSubject.trim().length > 0 ||
                    activeEditor.getContent({ format: 'text' }).trim().length > 0;
            }
        }
    };
    MessageHelper._isPasteEnabled = false;
    MessageHelper.messageEditorId = 'msg-tinymce-editor';
    /**
     * This method will return the selected item for priority dropdown based on priority name
     */
    MessageHelper.getPriorityDropDownSelectedItem = function (priorityName) {
        if (priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard)) {
            return enums.MessagePriority.Standard;
        }
        else if (priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Important)) {
            return enums.MessagePriority.Important;
        }
        else if (priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory)) {
            // When replying and forwarding a  mandatory message,priority need to be reset to standard.
            return enums.MessagePriority.Standard;
        }
    };
    /**
     * returns the navigate to default options for different message types.
     */
    MessageHelper.getNavigateAwayType = function (messageType) {
        var navigateTo = enums.SaveAndNavigate.none;
        switch (messageType) {
            case enums.MessageType.ResponseReply:
            case enums.MessageType.ResponseForward:
            case enums.MessageType.ResponseCompose:
                navigateTo = enums.SaveAndNavigate.toNewResponseMessageCompose;
                break;
        }
        return navigateTo;
    };
    /**
     * Returns true if focus needs to be set in tinymce editor else return false
     */
    MessageHelper.hasFocus = function (messageType) {
        return (messageType === enums.MessageType.InboxForward || messageType === enums.MessageType.InboxReply
            || messageType === enums.MessageType.ResponseReply || messageType === enums.MessageType.ResponseForward);
    };
    MessageHelper.addInitMouseClickEventScriptBlock = function () {
        // we have to close opened priority drop down and user options (logout options) while clicking on outside that. iframe was
        // preventing the click event to propagate outside so closing of those things are not happening while clicking on iframe.
        // dynamically add script to create mouse event
        var scriptElement = document.getElementById('init_mouse_click_event_script_block');
        var isScriptElementPresent = false;
        if (scriptElement != null) {
            isScriptElementPresent = true;
        }
        else {
            scriptElement = document.createElement('script');
            scriptElement.id = 'init_mouse_click_event_script_block';
            scriptElement.innerText =
                'function initMouseClickEvent() {' +
                    'let event = document.createEvent(\'MouseEvents\');' +
                    'event.initMouseEvent(\'click\', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);' +
                    'window.dispatchEvent(event); }';
        }
        if (!isScriptElementPresent) {
            document.body.appendChild(scriptElement);
        }
    };
    MessageHelper.removeInitMouseClickEventScriptBlock = function () {
        var scriptElement = document.getElementById('init_mouse_click_event_script_block');
        if (htmlUtilities.getUserDevice().browser !== 'IE') {
            document.body.removeChild(scriptElement);
        }
    };
    MessageHelper.setPasteEnabledAction = function (isPasteEnabled) {
        MessageHelper._isPasteEnabled = isPasteEnabled;
    };
    /**
     * Method which gets the selected QIG's name based on the Awarding Body specific QIG Naming format
     */
    MessageHelper.getCurrentQIGName = function () {
        // Calling the helper method to format the QIG Name
        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
            var selectedQig = qigStore.instance.selectedQIGForMarkerOperation;
            return stringFormatHelper.formatAwardingBodyQIG(selectedQig.markSchemeGroupName, selectedQig.assessmentCode, selectedQig.sessionName, selectedQig.componentId, selectedQig.questionPaperName, selectedQig.assessmentName, selectedQig.componentName, stringFormatHelper.getOverviewQIGNameFormat());
        }
        // If a QIG is not selected, return the default text to be shown on the drop down
        return localeStore.instance.TranslateText('messaging.compose-message.please-select-qig-placeholder');
    };
    /**
     * Handles changes in the message panel subject section.
     * @param e
     */
    MessageHelper.handleSubjectChange = function (subject) {
        MessageHelper.messageSubject = subject;
    };
    return MessageHelper;
}());
module.exports = MessageHelper;
//# sourceMappingURL=messagehelper.js.map