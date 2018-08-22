"use strict";
var React = require('react');
var messageHelper = require('../../../utility/message/messagehelper');
var localeStore = require('../../../../stores/locale/localestore');
var classNames = require('classnames');
var MessagePrioritySection = require('./messageprioritysection');
var ExceptionStatusIndicator = require('./exceptionstatusindicator');
/**
 * List Item component to display the linked message or exception
 * @param props
 */
var messageOrExceptionItem = function (props) {
    var renderStatus;
    if (props.isMessageItem) {
        renderStatus = (React.createElement(MessagePrioritySection, {itemId: props.itemId, priority: props.priorityOrStatus.toString()}));
    }
    else {
        renderStatus = (React.createElement(ExceptionStatusIndicator, {exceptionTypeId: +props.subjectOrType, status: +props.priorityOrStatus}));
    }
    var onClick = function () {
        props.onMessageOrExceptionItemSelected(props.isMessageItem, props.itemId);
    };
    var idPrefeix = props.isMessageItem ? props.id : props.itemId;
    return (React.createElement("li", {id: idPrefeix + '-item', onClick: onClick, className: classNames('list-item', { 'resolved': !props.isMessageItem && props.isUnreadOrUnactioned }, { 'unread': props.isUnreadOrUnactioned }, { 'selected': props.selectedItemId === props.itemId })}, React.createElement("div", {id: props.id + '-item-holder', className: 'list-item-holder'}, React.createElement("div", {className: 'list-item-row small-text clearfix'}, React.createElement("div", {id: props.id + '-item-text', className: 'list-item-data'}, props.senderOrItem), React.createElement("div", {id: props.id + '-item-time', className: 'status-date list-item-data dim-text'}, messageHelper.getDateToDisplay(props.timeToDisplay))), React.createElement("div", {className: 'list-item-row clearfix'}, React.createElement("div", {className: 'exception-title list-item-data'}, React.createElement("span", {id: props.id + '-item-content', className: 'list-item-content'}, props.isMessageItem ? props.subjectOrType : localeStore.
        instance.
        TranslateText('generic.exception-types.' + props.subjectOrType + '.name'))), renderStatus))));
};
module.exports = messageOrExceptionItem;
//# sourceMappingURL=messageorexceptionitem.js.map