import messagestore = require('../../../stores/message/messagestore');
import qigSummary = require('../../../stores/qigselector/typings/qigsummary');
import groupHelper = require('../../../utility/grouping/grouphelper');
import grouperList = require('../../../utility/grouping/groupingbase/grouperlist');
import Immutable = require('immutable');
import enums = require('../enums');
import localehelper = require('../../../utility/locale/localehelper');
import stringFormatHelper = require('../../../utility/stringformat/stringformathelper');
import localeStore = require('../../../stores/locale/localestore');
import messageEditorConstants = require('../messageeditorconstants');
import stringHelper = require('../../../utility/generic/stringhelper');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import navigationStore = require('../../../stores/navigation/navigationstore');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import qigStore = require('../../../stores/qigselector/qigstore');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import examinerStore = require('../../../stores/markerinformation/examinerstore');

declare let tinymce: any;

class MessageHelper {

    public static _isPasteEnabled: boolean = false;

    private static messageEditorId: string = 'msg-tinymce-editor';

    private static messageSubject: string;

    /**
     * Get the Header to display and the related messges
     * @param messages
     */
    public static getGroupedMessageObject(messages: Immutable.List<Message>, expandOrCollapseDetails: Immutable.Map<number, boolean>):
        MessageGroupDetails {
        // To store the messages after the grouping and sorting
        let messageList: Immutable.List<Message> = Immutable.List<Message>();

        // Get the messages grouped by QIG
        let groupedMessages = groupHelper.group(messages, grouperList.MessageQigGrouper, enums.GroupByField.qig);

        // Get the key seq
        let groupedKeys = groupedMessages.keySeq();

        // Create the return object
        let returnObj: MessageGroupData[] = [];

        // Loop through the keys and find the list of messages for the group.
        groupedKeys.forEach((qigId: string) => {
            // Get the messages for the group.
            let currentMessageGroup = groupedMessages.get(qigId);

            // Clear the collection, In each group.
            let messages = [];

            // Get the each messages for the group.
            currentMessageGroup.map((message: any) => {
                if (message.status === enums.MessageReadStatus.New && messagestore.instance.isMessageRead(message.examinerMessageId)) {
                    message.status = enums.MessageReadStatus.Read;
                }
                messages.push(message);
            });

            // Get the awarding body name format
            let nameToDisplay = MessageHelper.getDisplayText(messages[0]);

            let messageFolderType: enums.MessageFolderType = messages[0].messageFolderType;

            // Create an object to store messages
            let groupedObj: MessageGroupData = {
                qigId: parseInt(qigId),
                isOpen: this.isQigOpen(parseInt(qigId), messageFolderType, expandOrCollapseDetails),
                textToDisplay: nameToDisplay,
                messages: messages,
                unReadMessages: messages.filter((x: Message) =>
                    x.status === enums.MessageReadStatus.New && !messagestore.instance.isMessageRead(x.examinerMessageId)).length
            };

            returnObj.push(groupedObj);
        });

        // Sort the objects based on the display header.
        let getGroupedMessageObject = returnObj.sort(function (obj1: MessageGroupData, obj2: MessageGroupData) {
            return obj1.textToDisplay.localeCompare(obj2.textToDisplay);
        });

        // Get the messages as in the order of displaying in the UI
        getGroupedMessageObject.forEach((messageObject: MessageGroupData) => {
            messageList = Immutable.List<Message>(messageList.concat(messageObject.messages));
        });

        let messageGroupDetails: MessageGroupDetails = {
            // Stores the Grouped Object along with those messages
            MessageGroupObjects: getGroupedMessageObject,

            // Store all messages for the UI
            messages: messageList
        };

        return messageGroupDetails;
    }

    /**
     * Returns whether a particular qig is open or not
     * @param expandOrCollapseDetails 
     */
    private static isQigOpen(qigId: number, messageFolderType: enums.MessageFolderType,
        expandOrCollapseDetails: Immutable.Map<number, boolean>): boolean {
        return expandOrCollapseDetails ? expandOrCollapseDetails.get(qigId, true) : true;
    }

    /**
     * Get the time style for the Date
     * @param timeToDisplay
     * @param todayTextConversionRequired : for deciding Today text conversion
     */
    public static getDateToDisplay(timeToDisplay: string, todayTextConversionRequired: boolean = true) {
        let timeToDisplayDate = new Date(timeToDisplay);

        let todaysDate = new Date();

        let time: string = localehelper.toLocaleTimeString(new Date(timeToDisplay.toString()));

        // call setHours to take the time out of the comparison
        if ((timeToDisplayDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) && todayTextConversionRequired) {
            // Date equals today's date. Display date feild as Today.
            return localeStore.instance.TranslateText('messaging.message-lists.message-detail.date-today') + ' ' + time;
        } else {
            return localehelper.toLocaleDateString(new Date(timeToDisplay)) + ' ' + time;
        }
    }

    /**
     * Get the Display Header for the Group Header.
     * @param message
     */
    public static getDisplayText(message: Message) {
        let msg = messagestore.instance.messagesMarkSchemes;
        if (msg) {
            let messageList = msg.filter((messages: MessagingMarkScheme) => messages.markSchemeGroupId === message.markSchemeGroupId);
            {
                return stringFormatHelper.formatAwardingBodyQIG(
                    messageList.first().markSchemeGroupName,
                    messageList.first().assessmentCode,
                    messageList.first().sessionName,
                    messageList.first().componentId,
                    messageList.first().questionPaperName,
                    messageList.first().assessmentName,
                    messageList.first().componentName,
                    stringFormatHelper.getOverviewQIGNameFormat());
            }
        }
    }

    /**
     * Return the Mark Scheme Group Name
     * @param message
     */
    public static getMarkSchemeGroupName(message: Message): string {
        let msg = messagestore.instance.messagesMarkSchemes;
        if (msg) {
            return msg.filter((messages: MessagingMarkScheme) => messages.markSchemeGroupId === message.markSchemeGroupId).
                first().markSchemeGroupName;
        }
    }

    /**
     * Used to create the MessageOrExceptionLinkedItems based on the messages
     * @param messages
     */
    public static getMessageLinkedItems(messages: Immutable.List<Message>): Immutable.List<MessageOrExceptionLinkedItem> {
        let messageOrExceptionLinkedItems: MessageOrExceptionLinkedItem[] = [];
        let items = messages.forEach((message: Message) => {
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
    }

    /**
     * append examiners
     */
    private static appendExaminer(message: Message): string {

        let examiners: string = '';

        if (message && message.toExaminerDetails != null) {
            message.toExaminerDetails.map((item: Examiner) => {
                examiners += item.fullName + ';';
            });

            // removing last item semicolon
            return examiners.replace(/;$/, '');
        } else {
            examiners = message.examinerDetails.fullName;
        }

        return examiners;
    }

    /**
     * This method will returns the message content based on the template name
     * @param templateName - template name
     * @param messageBody - message content
     */
    public static getMessageContent(templateName: enums.MessageType, messageFrom?: string, date?: string, messageBody?: string) {
        let template: string;
        switch (templateName) {
            case enums.MessageType.InboxReply:
            case enums.MessageType.ResponseReply:
                template = stringHelper.format(localeStore.instance.TranslateText('messaging.compose-message.new-message-templates.reply'),
                    [messageEditorConstants.TINYMCE_DEFAULT_FONT, messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE,
                    this.getDateToDisplay(date, false), messageFrom, messageBody]);
                break;
            case enums.MessageType.InboxForward:
            case enums.MessageType.ResponseForward:
                template = stringHelper.format(localeStore.instance.TranslateText
                    ('messaging.compose-message.new-message-templates.forward'),
                    [messageEditorConstants.TINYMCE_DEFAULT_FONT, messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE,
                    this.getDateToDisplay(date, false), messageFrom, messageBody]);
                break;
            case enums.MessageType.ResponseCompose:
            case enums.MessageType.WorklistCompose:
            case enums.MessageType.InboxCompose:
            case enums.MessageType.TeamCompose:
                template = stringHelper.format(localeStore.instance.TranslateText('messaging.compose-message.new-message-templates.new'),
                    [messageEditorConstants.TINYMCE_DEFAULT_FONT, messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE]);
                break;

        }

        return template;
    }

    /**
     * This method will return the Menu Action items needed based on the folder type
     * @param folderType
     * @param messageActions: an array of message actions
     */
    public static getMessageMenuActionItems(folderType: enums.MessageFolderType, messageActions: Array<enums.MessageAction>) {
        let messageMenuActionItems: Array<any> = [];
        switch (folderType) {
            case enums.MessageFolderType.Inbox:
                if (messageActions && messageActions.length > 0) {
                    messageActions.map((x: enums.MessageAction) => {
                        let actionItems = this.messageActionItems(x);
                        if (actionItems) {
                            messageMenuActionItems.push(actionItems);
                        }
                    });
                }
        }
        return messageMenuActionItems;
    }

    /**
     * This method will return the localised message string based on message type
     */
    public static getMessageHeader(messageType: enums.MessageType) {
        let messageHeader: string;
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
    }

    /**
     * This method will returns the subject string
     * @param messageType
     * @param subject
     */
    public static getSubjectContent(messageType: enums.MessageType, subject: string) {
        let subjectText: string;
        let subjectPrefix: string;
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
    }

    /**
     * Get the Create new text for the component.
     */
    public static get getCreateNewMessageText(): string {
        return localeStore.instance.TranslateText('marking.response.message-list-panel.create-new-message');
    }

    /**
     * This method will return the Menu Action item based on the action parameter
     * @param messageAction
     */
    public static messageActionItems(messageAction: enums.MessageAction) {
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
    }

    /**
     * This method will return the selected item for priority dropdown based on priority name
     */
    public static getPriorityDropDownSelectedItem = (priorityName: string): enums.MessagePriority => {
        if (priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard)) {
            return enums.MessagePriority.Standard;
        } else if (priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Important)) {
            return enums.MessagePriority.Important;
        } else if (priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory)) {
            // When replying and forwarding a  mandatory message,priority need to be reset to standard.
            return enums.MessagePriority.Standard;
        }
    };

    /**
     * returns the navigate to default options for different message types.
     */
    public static getNavigateAwayType = (messageType: enums.MessageType): enums.SaveAndNavigate => {
        let navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none;

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
    public static hasFocus = (messageType: enums.MessageType) => {
        return (messageType === enums.MessageType.InboxForward || messageType === enums.MessageType.InboxReply
            || messageType === enums.MessageType.ResponseReply || messageType === enums.MessageType.ResponseForward);
    };

    public static addInitMouseClickEventScriptBlock = () => {
        // we have to close opened priority drop down and user options (logout options) while clicking on outside that. iframe was
        // preventing the click event to propagate outside so closing of those things are not happening while clicking on iframe.
        // dynamically add script to create mouse event
        let scriptElement = document.getElementById('init_mouse_click_event_script_block');
        let isScriptElementPresent: boolean = false;
        if (scriptElement != null) {
            isScriptElementPresent = true;
        } else {
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

    public static removeInitMouseClickEventScriptBlock = () => {
        let scriptElement = document.getElementById('init_mouse_click_event_script_block');
        if (htmlUtilities.getUserDevice().browser !== 'IE') {
            document.body.removeChild(scriptElement);
        }
    };

    public static setPasteEnabledAction = (isPasteEnabled: boolean) => {
        MessageHelper._isPasteEnabled = isPasteEnabled;
    };


    /**
     * This method will update the IFrame content with message details
     * @param o
     * @param e
     */
    public static addIFrameForMessageDetails(o: any, e: any) {
        let timeout: number = 0;
        // add script to init mouse click event in parent window for any 'click' in current window
        let scriptBlock = 'window.addEventListener(\'click\', function() { parent.initMouseClickEvent(); });';

        let headTagContent = '<style type="text/css"> p,body{margin:0;padding:0;}</style>';

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
        } else {
            //incluse script to init mouse click event in parent window for any 'touch' in current window
            scriptBlock +=
                'window.addEventListener(\'touchend\', function() { parent.initMouseClickEvent(); });';
        }

        let content: string = e.getContent().trim() +
            '<script>' + scriptBlock + '</script >';
        // put a timeout of 0, otherwise message details are not rendering on first message item click
        if (!htmlUtilities.isTabletOrMobileDevice && htmlUtilities.getUserDevice().browser === 'Firefox') {
            timeout = 50;
        }
        setTimeout(() => {
            $('#msg-iframe_ifr').contents().find('head').html(headTagContent);
            $('#msg-iframe_ifr').contents().find('body').html(content);
        }, timeout);
    }

    /**
     * Method which gets the selected QIG's name based on the Awarding Body specific QIG Naming format
     */
    public static getCurrentQIGName = () => {
        // Calling the helper method to format the QIG Name
        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
            let selectedQig = qigStore.instance.selectedQIGForMarkerOperation;
            return stringFormatHelper.formatAwardingBodyQIG(
                selectedQig.markSchemeGroupName,
                selectedQig.assessmentCode,
                selectedQig.sessionName,
                selectedQig.componentId,
                selectedQig.questionPaperName,
                selectedQig.assessmentName,
                selectedQig.componentName,
                stringFormatHelper.getOverviewQIGNameFormat());
        }
        // If a QIG is not selected, return the default text to be shown on the drop down
        return localeStore.instance.TranslateText('messaging.compose-message.please-select-qig-placeholder');
    };

    /**
     * Returns a boolean indicating whether the message panel is edited.
     */
    public static isMessagePanelEdited(messageType: enums.MessageType, messageToFieldValues: Array<string>,
        messageToFieldIds: Array<number>) {
        if (messagestore.instance.isMessagePanelActive) {
            let currentActiveEditorId = tinymce.activeEditor.id;
            let activeEditor = tinymce.get(MessageHelper.messageEditorId);
            if (messageType === enums.MessageType.InboxCompose || messageType === enums.MessageType.InboxForward ||
                messageType === enums.MessageType.InboxReply) {
                return MessageHelper.messageSubject && MessageHelper.messageSubject.trim().length > 0 ||
                    activeEditor.getContent({ format: 'text' }).trim().length > 0 ||
                    ((messageToFieldValues && messageToFieldValues.length > 0) &&
                        (messageToFieldIds && messageToFieldIds.length > 0));
            } else if (messageType === enums.MessageType.ResponseCompose
                || messageType === enums.MessageType.WorklistCompose || messageType === enums.MessageType.ResponseReply
                || messageType === enums.MessageType.ResponseForward || messageType === enums.MessageType.TeamCompose) {
                return MessageHelper.messageSubject && MessageHelper.messageSubject.trim().length > 0 ||
                    activeEditor.getContent({ format: 'text' }).trim().length > 0;
            }
        }
    }

    /**
     * Handles changes in the message panel subject section.
     * @param e
     */
    public static handleSubjectChange = (subject: string) => {
        MessageHelper.messageSubject = subject;
    };

    /**
     * This method revamps the marking mode naming for display in message
     * @param markingMode
     * @param isElectronicStandardisationTeamMember
     */
    public static getMarkingModeText(markingMode: number, isElectronicStandardisationTeamMember: number) {
        if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            if (isElectronicStandardisationTeamMember) {
                return ((localeStore.instance.TranslateText
                    ('marking.worklist.response-data.stm-standardisation-response-title')) + ' ');
            } else {
                return ((localeStore.instance.TranslateText
                    ('marking.worklist.response-data.second-standardisation-response-title')) + ' ');
            }
        } else if (markingMode === enums.MarkingMode.Practice) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title')) + ' ');
        } else if (markingMode === enums.MarkingMode.Approval) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title')) + ' ');
        } else if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            return ((localeStore.instance.TranslateText
                ('marking.worklist.response-data.second-standardisation-response-title')) + ' ');
        } else {
            return '';
        }
    }
}

export = MessageHelper;