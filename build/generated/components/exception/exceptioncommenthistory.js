"use strict";
var enums = require('../utility/enums');
var React = require('react');
var classNames = require('classnames');
var messageHelper = require('../utility/message/messagehelper');
var localeStore = require('../../stores/locale/localestore');
/* tslint:disable:variable-name */
var ExceptionCommentHistory = function (props) {
    return (React.createElement("div", {key: props.key, className: classNames('exception-history-item')}, React.createElement("div", {className: 'exception-history-item-header'}, React.createElement("div", {className: 'exception-history-item-left item-title'}, React.createElement("span", {className: 'exception-examiner', id: 'exception_commentedby' + props.id}, props.commentedBy), React.createElement("span", {className: 'exception-history-status', id: 'exception_status' + props.id}, "(", localeStore.instance.
        TranslateText('generic.exception-statuses.' +
        enums.getEnumString(enums.ExceptionStatus, props.exceptionStatus).toLowerCase()), ") ")), React.createElement("div", {className: 'exception-history-item-right'}, React.createElement("div", {className: 'exception-history-tem-date'}, messageHelper.getDateToDisplay(props.updatedDate)))), React.createElement("div", {className: 'exception-history-item-content', id: 'exception_comments' + props.id}, props.comments)));
};
module.exports = ExceptionCommentHistory;
//# sourceMappingURL=exceptioncommenthistory.js.map