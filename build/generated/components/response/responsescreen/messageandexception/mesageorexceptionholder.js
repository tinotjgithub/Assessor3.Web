"use strict";
var React = require('react');
var messageHelper = require('../../../utility/message/messagehelper');
var localeStore = require('../../../../stores/locale/localestore');
var MessageOrExceptionItem = require('./messageorexceptionitem');
var exceptionHelper = require('../../../utility/exception/exceptionhelper');
var classNames = require('classnames');
var markingOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * this component is used to Render the message / exceptions items inside the response screen
 * Messages and Exceptions associated with the response should pass to the component and cunstruct the new entity here.
 * Make the changes in the class without affecting both messages and Exception.
 * @param props
 */
var mesageOrExceptionHolder = function (props) {
    if (!props.messages && !props.doShowExceptionPanel) {
        return null;
    }
    var isTeamManagement = markingOperationModeFactory.operationMode.isTeamManagementMode;
    var idPrefix;
    var messageOrExceptionLinkedItems;
    var renderHeader;
    if (props.isMessageHolder) {
        idPrefix = 'message-';
        messageOrExceptionLinkedItems = messageHelper.getMessageLinkedItems(props.messages);
        renderHeader = (React.createElement("use", {xlinkHref: '#new-message-icon'}));
    }
    else if (props.messages) {
        idPrefix = 'exception-';
        messageOrExceptionLinkedItems = exceptionHelper.getExceptionLinkedItems(props.messages, isTeamManagement);
        renderHeader = props.canRaiseException ? (React.createElement("use", {xlinkHref: '#new-exception-icon'})) :
            (React.createElement("use", {xlinkHref: '#exception-icon'}));
    }
    var toRender = [];
    if (props.messages) {
        messageOrExceptionLinkedItems.map(function (messageOrExceptionLinkedItem, index) {
            toRender.push((React.createElement(MessageOrExceptionItem, {id: idPrefix + index, key: idPrefix + index, selectedItemId: props.selectedItemId, itemId: messageOrExceptionLinkedItem.itemId, senderOrItem: messageOrExceptionLinkedItem.senderOrItem, priorityOrStatus: messageOrExceptionLinkedItem.priorityOrStatus, subjectOrType: messageOrExceptionLinkedItem.subjectOrType, onMessageOrExceptionItemSelected: props.onMessageOrExceptionItemSelected, timeToDisplay: messageOrExceptionLinkedItem.timeToDisplay, isUnreadOrUnactioned: messageOrExceptionLinkedItem.isUnreadOrUnactioned, isMessageItem: props.isMessageHolder})));
        });
    }
    // Pass Click to the parent for raising new exception or message
    var onClick = function (event) {
        props.onNewMessageOrExceptionClick(props.isMessageHolder);
    };
    // set title text for the panel
    var createNewText = props.isMessageHolder ? messageHelper.getCreateNewMessageText :
        (props.canRaiseException) ? localeStore.instance.TranslateText('marking.response.exception-list-panel.raise-new-exception') :
            localeStore.instance.TranslateText('assessor3.exceptions.title_editable_tab');
    // render reject rig element
    var showRejectRig = props.doShowRejectThisResponse ? (React.createElement("div", {id: 'reject-rig', className: 'list-menu-footer', onClick: function () { props.onRejectRigClick(); }}, React.createElement("a", {href: '#'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'reject-rig-icon'}, React.createElement("use", {xlinkHref: '#reject-rig-icon'}))), React.createElement("span", {className: 'rject-repsone-text', id: 'reject-rig-Text'}, localeStore.instance.TranslateText('marking.response.exception-list-panel.reject-rig'))))) : null;
    // render exception contents.
    var showMenuContent = props.messages && props.messages.size > 0 ? (React.createElement("div", {id: idPrefix + 'contents', className: 'list-menu-content'}, React.createElement("ul", {id: idPrefix + 'contents-holder', className: 'list-menu-item-holder'}, toRender))) : null;
    // set the new item header for the panel
    var renderNewItemHeader = (props.isMessageHolder && props.isNewMessageButtonHidden) ||
        (!props.isMessageHolder && !props.canRaiseException) ?
        null : (React.createElement("div", {id: idPrefix + 'header', onClick: (props.canRaiseException && !props.isMessageHolder) ||
        props.isMessageHolder ? onClick : null, className: 'list-menu-header'}, React.createElement("a", {id: idPrefix + 'create-new-item', className: 'create-new-list-item'}, React.createElement("span", {id: idPrefix + 'create-new-icon', className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'marking-exception-icon'}, renderHeader)), React.createElement("span", {id: idPrefix + 'create-new-label', className: 'new-message-label'}, createNewText))));
    return (React.createElement("div", {className: classNames('tool-option-menu list-menu menu', { 'message-menu': props.isMessageHolder }, { 'exception-menu': !props.isMessageHolder }), id: idPrefix + 'holder'}, renderNewItemHeader, showMenuContent, showRejectRig));
};
module.exports = mesageOrExceptionHolder;
//# sourceMappingURL=mesageorexceptionholder.js.map