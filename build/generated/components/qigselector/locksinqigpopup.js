"use strict";
var React = require('react');
var Immutable = require('immutable');
var qigStore = require('../../stores/qigselector/qigstore');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var localeStore = require('../../stores/locale/localestore');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var locksInQigPopup = function (props) {
    /**
     * Handles the Click Event of locked qig
     */
    var openQigFromLockedList = function (qigId) {
        qigSelectorActionCreator.qigSelectedFromLockedList(qigId);
    };
    if (props.showLocksInQigPopUp) {
        return (React.createElement("div", {className: 'popup medium popup-overlay fixed-hf examiner-locked open', id: 'examinerLocked', role: 'dialog'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup17Title'}, localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.header'))), React.createElement("div", {className: 'popup-content', id: 'popup16Desc'}, React.createElement("p", {className: 'login-nav-msg padding-bottom-10'}, localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.body')), React.createElement("p", {className: 'login-nav-action padding-bottom-10'}, (props.fromLogout) ? localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.body-logout') : localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.select-a-qig')), getLocksInQigList()), renderLogoutSection())));
    }
    else {
        return null;
    }
    /**
     * Returns the list of qigs with no of locks
     */
    function getLocksInQigList() {
        var _this = this;
        var locksInQigDetailsList = Immutable.List();
        locksInQigDetailsList = qigStore.instance.getLocksInQigList.locksInQigDetailsList;
        var toRender = locksInQigDetailsList.map(function (_locksInQigDetails, key) {
            var formattedQigName = stringFormatHelper.formatAwardingBodyQIG(_locksInQigDetails.qigName, _locksInQigDetails.assessmentCode, _locksInQigDetails.sessionName, _locksInQigDetails.componentId, _locksInQigDetails.questionPaperName, _locksInQigDetails.assessmentName, _locksInQigDetails.componentName, stringFormatHelper.getOverviewQIGNameFormat());
            return (React.createElement("a", {key: 'lock-' + key, className: 'locked-link table-row', onClick: openQigFromLockedList.bind(_this, _locksInQigDetails.qigId)}, React.createElement("span", {className: 'lock-msg table-cell bolder'}, React.createElement("span", {className: 'lock-count'}, _locksInQigDetails.noOfLocks), React.createElement("span", {className: 'lock-text'}, (_locksInQigDetails.noOfLocks > 1) ? localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.locks-plural') : localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.lock-single'))), React.createElement("span", {className: 'lock-hyphen table-cell'}, "-"), React.createElement("span", {className: 'lock-qig-name table-cell'}, formattedQigName)));
        });
        return (React.createElement("div", {className: 'lock-list-wrapper'}, React.createElement("div", {id: 'lock-list-table', className: 'lock-list table'}, toRender)));
    }
    /**
     * renders the logout button portion if needed
     */
    function renderLogoutSection() {
        if (props.fromLogout) {
            return (React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("button", {id: 'lockslogoutbutton', className: 'button rounded', title: localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button'), onClick: function () { props.onLogoutClickOfLocksInQigPopup(); }}, localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button')), React.createElement("button", {id: 'lockscancelbutton', className: 'button primary rounded', title: localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.cancel-button'), onClick: function () { props.onCancelClickOfLocksInQigPopup(); }}, localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.cancel-button'))));
        }
        else {
            return null;
        }
    }
};
module.exports = locksInQigPopup;
//# sourceMappingURL=locksinqigpopup.js.map