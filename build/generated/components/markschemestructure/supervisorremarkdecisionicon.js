"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
/**
 * Supervisor remark decision icon in worklist.
 * @param props
 */
var supervisorremarkdecisionicon = function (props) {
    return (React.createElement("div", {className: classNames('col wl-eur-reason-holder', { 'text-left': props.isTileView })}, React.createElement("div", {className: 'col-inner'}, React.createElement("a", {className: 'resp-alerts', title: localeStore.instance.TranslateText('marking.worklist.response-data.supervisor-remark-decision-not-specified-icon-tooltip')}, React.createElement("span", {className: 'sprite-icon edit-box-yellow-icon', id: props.id})))));
};
module.exports = supervisorremarkdecisionicon;
//# sourceMappingURL=supervisorremarkdecisionicon.js.map