"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var classNames = require('classnames');
var localeStore = require('../../../../stores/locale/localestore');
var supervisorRemarkIcon = function (props) {
    /**
     * This method displays the message within the remark holder if remark already raised for the response.
     */
    var renderRemarkRaised = function () {
        if (props.isSupervisorRemarkRaised) {
            return (React.createElement("div", {id: 'supervisor-remark-raised', className: 'raise-remark-desc'}, React.createElement("p", null, localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.supervisor-remark-already-raised'))));
        }
    };
    var renderButtons = (!props.isOpen) ? null : (React.createElement("div", {className: 'tool-option-menu menu'}, React.createElement("div", {className: 'raise-remark-holder', id: 'supervisor-remark-panel'}, React.createElement("div", {className: 'raise-remark-title'}, localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.header')), renderRemarkRaised(), React.createElement("div", {className: 'remark-button-holder'}, React.createElement("button", {className: 'button primary rounded', onClick: function () { props.onMarkNowButtonClicked(); }, id: 'sup-mark-now'}, localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.mark-now-button'))), React.createElement("div", {className: 'remark-button-holder'}, React.createElement("button", {className: 'button rounded', onClick: function () { props.onMarkLaterButtonClicked(); }, id: 'sup-mark-later'}, localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.mark-later-button'))))));
    if (props.isSupervisorRemarkButtonVisible) {
        return (React.createElement("li", {id: 'sup-icon', className: classNames('mrk-zoom-icon dropdown-wrap', { 'open': props.isOpen }, { 'close': (!props.isOpen) }), onClick: function () { props.onRemarkButtonClicked(); }, title: localeStore.instance.TranslateText('team-management.response.left-toolbar.supervisor-remark-button-tooltip')}, React.createElement("a", {className: 'menu-button', href: '#'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {className: 'supervisor-remark-icon', viewBox: '0 0 32 32'}, React.createElement("use", {xlinkHref: '#supervisor-remark-icon'}))), React.createElement("span", {className: 'sprite-icon toolexpand-icon'}, "Supervisor Remark")), renderButtons));
    }
    else {
        return null;
    }
};
module.exports = supervisorRemarkIcon;
//# sourceMappingURL=supervisorremarkicon.js.map