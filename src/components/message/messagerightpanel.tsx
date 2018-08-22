import messageTranslationHelper = require('../utility/message/messagetranslationhelper');
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import MessagePriorityDescription = require('./messageprioritydescription');
import MessageDetailsSenderInfo = require('./messagedetailssenderinfo');
import MessageDetailsSenderDate = require('./messagedetailssenderdate');
import enums = require('../utility/enums');
import MessageActionMenu = require('./messageactionmenu');
import localeStore = require('../../stores/locale/localestore');
import messageHelper = require('../utility/message/messagehelper');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import qigStore = require('../../stores/qigselector/qigstore');
const TINYMCE = require('react-tinymce');
let classNames = require('classnames');

declare let tinymce: any;
interface Props extends LocaleSelectionBase, PropsBase {
    message: Message;
    messageDetails: MessageDetails;
    selectedTab: enums.MessageFolderType;
    isForwardButtonHidden: boolean;
    onMessageMenuActionClickCallback?: Function;
    onDisplayIdClick?: Function;
}

/**
 * Message Description Area
 * @param props
 */
const messageRightPanel = (props: Props) => {

    if (props.message === undefined || props.messageDetails == null) {
        // Message is not yet selected. No Need to handle here.
        return null;
    }

    if (qigStore.instance.isQIGHidden(props.message.markSchemeGroupId)) {
        // No message in the right panel.
        return null;
    }

    /**
     * Make the string as html.
     * @param messageContent
     */
    function createMarkup() {
        // Defect 29714 fix
        // styles applied from web assessor will apply to all elements in mark scheme panel
        // to avoid that, render the mesage content in an iframe element
        // Defect 29926, 29976, 29977 fix : remove html scripts in message body
        let iframe = document.createElement('iframe');
        iframe.id = 'msg-iframe_ifr';
        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframe.style.display = 'block';

        return { __html: iframe.outerHTML };
    }

    let translatedMessageContents: TranslatedMessageContent = messageTranslationHelper.getTranslatedContent(props.message);

    /**
     * This method will returns the message body
     */
    function getMessageBody() {
    // If selected message is a system message then returns the corresponding language json file entry
        if (props.message.examBodyMessageTypeId != null && props.message.examBodyMessageTypeId !== enums.SystemMessage.None) {
            return translatedMessageContents.content;
        } else {
            return props.messageDetails.body;
        }
    }

    /**
     * This method will return the message actions
     */
    function getMessageActions(): Array<enums.MessageAction> {
        let messageActions: Array<enums.MessageAction> = new Array<enums.MessageAction>();
        // Add Reply action if and only if the reply field is null or true
        if (props.message.canReply == null || props.message.canReply) {
            messageActions.push(enums.MessageAction.Reply);
        }

        // Add forward action if isForwardButtonHidden field is false
        if (!props.isForwardButtonHidden) {
            messageActions.push(enums.MessageAction.Forward);
        }
        messageActions.push(enums.MessageAction.Delete);
        return messageActions;
    }

    /**
     * This method will return the selected Tab for linked messages and Message page
     */
    function getSelectedTab(): enums.MessageFolderType {
        // This will handle linked message folder types
        if (props.selectedTab === enums.MessageFolderType.None) {
            return props.message.messageFolderType;
        } else {
            return props.selectedTab;
        }
    }

    let editorConfig = {
        readonly: 1,
        menubar: false,
        statusbar: false,
        toolbar: false,
        fontsize_formats: false,
        font_formats: false,
        valid_children: '+body[style]', //allows style element inside body element to support html messages from Web assessor,
        invalid_elements : 'embed'
    };

    if (tinymce.get('msg-tinymce_ifr')) {
        tinymce.get('msg-tinymce_ifr').destroy();
    }

    /**
     * This method will call on tinyMCE content setting
     * @param o
     * @param e
     */
    function setContent(o: any, e: any) {
        messageHelper.addIFrameForMessageDetails(o, e);
    }

    let tinymceElement = <TINYMCE
        content={ getMessageBody() }
        Id= {'msg-tinymce_ifr'}
        config={editorConfig}
        onSetContent={ setContent }
        />;

    return (
        <div className={classNames(
            { 'column-right message-expanded': props.selectedTab !== enums.MessageFolderType.None },
            { 'messaging-content': props.selectedTab === enums.MessageFolderType.None }) }>
            <div className={classNames('msg-exp-wrapper', { 'wrapper': props.selectedTab !== enums.MessageFolderType.None }) }>
                <div className='msg-exp-header'>
                    <div className='msg-subject-wrap clearfix'>
                        <div className='msg-subject'>
                            <h4 className='msg-subject-title' id='msg-det-sender-info-subject'>{translatedMessageContents.subject}</h4>
                        </div>
                    </div>
                </div>
                <div className='msg-exp-metainfo'>
                    <div className='col-wrap responsive-medium'>
                        <MessageActionMenu
                            id = 'message-action-menu'
                            key = 'key-message-action-menu'
                            items = { messageHelper.getMessageMenuActionItems
                                (getSelectedTab(), getMessageActions()) }
                            onClick = { (messageAction: enums.MessageAction) => {
                                props.onMessageMenuActionClickCallback(messageAction);
                            } } />
                        <MessageDetailsSenderDate
                            id = 'msg-det-sender-info'
                            key = 'msg-det-sender-info'
                            displayDate = {props.message.displayDate}/>
                    </div>
                    <MessageDetailsSenderInfo
                        id = 'msg-det-sender-info'
                        key = 'msg-det-sender-info'
                        selectedLanguage = {props.selectedLanguage}
                        message = {props.message}
                        messageDetails = {props.messageDetails}
                        selectedTab = {props.selectedTab}
                        onDisplayIdClick = {props.onDisplayIdClick} />
                    <MessagePriorityDescription
                        selectedLanguage = {props.selectedLanguage}
                        id ='msg-det-priority-desc'
                        key ='msg-det-priority-desc'
                        messagePriorityName = {props.message.priorityName} />
                </div>
                <div  style={{ display: 'none' }}>{tinymceElement}</div>
                <div className='msg-exp-body'
                    dangerouslySetInnerHTML = {createMarkup()}>
                </div>
            </div>
        </div>
    );
};

export = messageRightPanel;