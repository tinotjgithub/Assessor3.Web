"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var stringHelper = require('../../../utility/generic/stringhelper');
var SendMessageLink = require('./sendmessagelink');
var classNames = require('classnames');
/**
 * React class for supervisor information.
 */
var SupervisorInformation = (function (_super) {
    __extends(SupervisorInformation, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function SupervisorInformation(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for supervisor information.
     */
    SupervisorInformation.prototype.render = function () {
        if (this.props.isTeamManagementMode || this.props.supervisorName === '') {
            return (React.createElement("div", null));
        }
        var sendMessageLink = this.props.showMessageLink ?
            (React.createElement(SendMessageLink, {onClick: this.props.showMessagePopup, id: 'sendMsg', key: 'sendMsg'})) : null;
        return (React.createElement("div", {id: 'supervisor_info_panel', className: 'supervisor-info relative clearfix padding-bottom-30'}, React.createElement("div", {className: 'user-photo-holder user-medium-icon sprite-icon'}, React.createElement("span", {className: classNames('online-status-bubble', { 'online': this.props.isSupervisorOnline })})), React.createElement("div", {className: 'hierarchy-line'}), React.createElement("div", {className: 'user-details-holder'}, React.createElement("div", {className: 'online-status small-text'}, this.getSupervisorOnlineStatusText()), React.createElement("div", {id: 'supervisor_name', className: 'user-name large-text'}, this.props.supervisorName), React.createElement("div", {id: 'supervisor_designation', className: 'designation small-text'}, localeStore.instance.TranslateText('marking.worklist.left-panel.my-supervisor')), sendMessageLink)));
    };
    /**
     * This method will return the localised text for supervisor online status.
     */
    SupervisorInformation.prototype.getSupervisorOnlineStatusText = function () {
        var offlineHours = Math.floor(this.props.supervisorLogoutDiffInMinutes / 60);
        var offlineDays = 0;
        if (this.props.isSupervisorOnline) {
            return localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-online');
        }
        else {
            if (this.props.supervisorLogoutDiffInMinutes === -1) {
                return localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline');
            }
            else if (offlineHours === 0) {
                return localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-less-than-1-hour');
            }
            else if (offlineHours === 1) {
                return stringHelper.format(localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-hour'), [String(offlineHours)]);
            }
            else if (offlineHours > 1 && offlineHours < 24) {
                return stringHelper.format(localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-hours'), [String(offlineHours)]);
            }
            else if (offlineHours < 48) {
                offlineDays = Math.floor(offlineHours / 24);
                return stringHelper.format(localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-day'), [String(offlineDays)]);
            }
            else if (offlineHours >= 48) {
                offlineDays = Math.floor(offlineHours / 24);
                return stringHelper.format(localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-days'), [String(offlineDays)]);
            }
        }
    };
    return SupervisorInformation;
}(pureRenderComponent));
module.exports = SupervisorInformation;
//# sourceMappingURL=supervisorinformation.js.map