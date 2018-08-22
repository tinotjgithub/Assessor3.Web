"use strict";
var React = require('react');
var enums = require('../../../utility/enums');
var exceptionStore = require('../../../../stores/exception/exceptionstore');
var localeStore = require('../../../../stores/locale/localestore');
/**
 * Handles the status of exception
 * @param props
 */
var exceptionStatusIndicator = function (props) {
    var renderStatus;
    var isBlocker = exceptionStore.instance.isExceptionBlocker(props.exceptionTypeId);
    if (isBlocker && props.status !== enums.ExceptionStatus.Closed) {
        var title = props.status === enums.ExceptionStatus.Resolved ? localeStore.instance.
            TranslateText('marking.response.exception-list-panel.exception-blocker-resolved') :
            localeStore.instance.TranslateText('marking.response.exception-list-panel.open-blocking-exception-tooltip');
        renderStatus = (React.createElement("span", {className: 'exception-status-icon blocking-exception', title: title}, React.createElement("svg", {width: '100%', height: '100%', viewBox: '0 0 12 12', className: 'marking-exception-icon'}, React.createElement("use", {xlinkHref: '#exception-icon'}))));
    }
    return (React.createElement("div", {className: 'small-text exception-status'}, renderStatus, React.createElement("span", {className: 'exception-status-text'}, localeStore.instance.TranslateText('generic.exception-statuses.'
        + enums.getEnumString(enums.ExceptionStatus, props.status).toLowerCase()))));
};
module.exports = exceptionStatusIndicator;
//# sourceMappingURL=exceptionstatusindicator.js.map