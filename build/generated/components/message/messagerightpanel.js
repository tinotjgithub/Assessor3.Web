"use strict";
var messageTranslationHelper = require('../utility/message/messagetranslationhelper');
var React = require('react');
var MessagePriorityDescription = require('./messageprioritydescription');
var MessageDetailsSenderInfo = require('./messagedetailssenderinfo');
var MessageDetailsSenderDate = require('./messagedetailssenderdate');
var enums = require('../utility/enums');
var MessageActionMenu = require('./messageactionmenu');
var messageHelper = require('../utility/message/messagehelper');
var TINYMCE = require('react-tinymce');
var classNames = require('classnames');
/**
 * Message Description Area
 * @param props
 */
var messageRightPanel = function (props) {
    if (props.message === undefined || props.messageDetails == null) {
        // Message is not yet selected. No Need to handle here.
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
        var iframe = document.createElement('iframe');
        iframe.id = 'msg-iframe_ifr';
        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframe.style.display = 'block';
        return { __html: iframe.outerHTML };
    }
    var translatedMessageContents = messageTranslationHelper.getTranslatedContent(props.message);
    /**
     * This method will returns the message body
     */
    function getMessageBody() {
        // If selected message is a system message then returns the corresponding language json file entry
        if (props.message.examBodyMessageTypeId != null && props.message.examBodyMessageTypeId !== enums.SystemMessage.None) {
            return translatedMessageContents.content;
        }
        else {
            return props.messageDetails.body;
        }
    }
    /**
     * This method will return the message actions
     */
    function getMessageActions() {
        var messageActions = new Array();
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
    function getSelectedTab() {
        // This will handle linked message folder types
        if (props.selectedTab === enums.MessageFolderType.None) {
            return props.message.messageFolderType;
        }
        else {
            return props.selectedTab;
        }
    }
    var editorConfig = {
        readonly: 1,
        menubar: false,
        statusbar: false,
        toolbar: false,
        fontsize_formats: false,
        font_formats: false,
        valid_children: '+body[style]',
        invalid_elements: 'embed'
    };
    if (tinymce.get('msg-tinymce_ifr')) {
        tinymce.get('msg-tinymce_ifr').destroy();
    }
    /**
     * This method will call on tinyMCE content setting
     * @param o
     * @param e
     */
    function setContent(o, e) {
        messageHelper.addIFrameForMessageDetails(o, e);
    }
    var tinymceElement = React.createElement(TINYMCE, {content: getMessageBody(), Id: 'msg-tinymce_ifr', config: editorConfig, onSetContent: setContent});
    return (React.createElement("div", {className: classNames({ 'column-right message-expanded': props.selectedTab !== enums.MessageFolderType.None }, { 'messaging-content': props.selectedTab === enums.MessageFolderType.None })}, React.createElement("div", {className: classNames('msg-exp-wrapper', { 'wrapper': props.selectedTab !== enums.MessageFolderType.None })}, React.createElement("div", {className: 'msg-exp-header'}, React.createElement("div", {className: 'msg-subject-wrap clearfix'}, React.createElement("div", {className: 'msg-subject'}, React.createElement("h4", {className: 'msg-subject-title', id: 'msg-det-sender-info-subject'}, translatedMessageContents.subject)))), React.createElement("div", {className: 'msg-exp-metainfo'}, React.createElement("div", {className: 'col-wrap responsive-medium'}, React.createElement(MessageActionMenu, {id: 'message-action-menu', key: 'key-message-action-menu', items: messageHelper.getMessageMenuActionItems(getSelectedTab(), getMessageActions()), onClick: function (messageAction) {
        props.onMessageMenuActionClickCallback(messageAction);
    }}), React.createElement(MessageDetailsSenderDate, {id: 'msg-det-sender-info', key: 'msg-det-sender-info', displayDate: props.message.displayDate})), React.createElement(MessageDetailsSenderInfo, {id: 'msg-det-sender-info', key: 'msg-det-sender-info', selectedLanguage: props.selectedLanguage, message: props.message, messageDetails: props.messageDetails, selectedTab: props.selectedTab, onDisplayIdClick: props.onDisplayIdClick}), React.createElement(MessagePriorityDescription, {selectedLanguage: props.selectedLanguage, id: 'msg-det-priority-desc', key: 'msg-det-priority-desc', messagePriorityName: props.message.priorityName})), React.createElement("div", {style: { display: 'none' }}, tinymceElement), React.createElement("div", {className: 'msg-exp-body', dangerouslySetInnerHTML: createMarkup()}))));
};
module.exports = messageRightPanel;
//# sourceMappingURL=messagerightpanel.js.map