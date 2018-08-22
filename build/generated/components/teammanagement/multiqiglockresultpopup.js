"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var classNames = require('classnames');
var pureRenderComponent = require('../base/purerendercomponent');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var MultiQigLockResultItem = require('./multiQigLockResultItem');
var GenericButton = require('../utility/genericbutton');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
/**
 * React wrapper component for multi qig lock result popup
 */
var MultiQigLockResultPopup = (function (_super) {
    __extends(MultiQigLockResultPopup, _super);
    /**
     * @constructor
     */
    function MultiQigLockResultPopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isShowMultiLockResultPopup = false;
        /**
         * This method will call on multi qig lock result load
         */
        this.onMultiQigLockResultLoad = function (multiLockResults) {
            if (teamManagementStore.instance.multiLockResults
                && teamManagementStore.instance.multiLockResults.count() > 0) {
                _this.multiLockResults = multiLockResults;
                _this.isShowMultiLockResultPopup = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This method will call on ok click
         */
        this.okOnClick = function () {
            // Invoke help examiner data retrieve action for getting refreshed data and update the store.
            teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
            // Invoke team over view count.
            teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
            if (teamManagementStore.instance.multiLockExaminerDrillDownData) {
                var examinerDrillDownData = teamManagementStore.instance.multiLockExaminerDrillDownData;
                // Navigate to help examiner worklist after completed the lock operation.
                teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
            }
            // Invoke method to clear the multi lock data.
            teamManagementActionCreator.resetMultiLockData();
            _this.isShowMultiLockResultPopup = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            renderedOn: 0
        };
        this.multiLockResults = teamManagementStore.instance.multiLockResults;
    }
    /**
     * Render method
     */
    MultiQigLockResultPopup.prototype.render = function () {
        this.multiLockResults = teamManagementStore.instance.multiLockResults;
        var successfullyLockedQigs;
        var lockFailedQigs;
        var multiLockResultPopup;
        var itemCount = 0;
        var className = classNames('popup medium popup-overlay qig-lock fixed-hf', { 'open': this.isShowMultiLockResultPopup === true }, { 'close': this.isShowMultiLockResultPopup === false });
        var multiLockAvailable = this.multiLockResults && this.multiLockResults.count() > 0;
        if (multiLockAvailable) {
            // Fetch successfully locked multi Qig list
            var successLockList = this.multiLockResults.filter(function (item) {
                return item.failureCode === enums.FailureCode.None;
            }).toList();
            // Fetch failed multi Qig lock list
            var failureLockList = this.multiLockResults.filter(function (item) {
                return item.failureCode !== enums.FailureCode.None;
            }).toList();
            // Bind successfully locked multi Qig list
            if (successLockList && successLockList.count() > 0) {
                var successfullock = successLockList.map(function (item) {
                    itemCount++;
                    return (React.createElement(MultiQigLockResultItem, {id: 'multi-qig-lock-result-success-item' + itemCount, key: 'multi-qig-lock-result-success-item-key-' + itemCount, className: itemCount === 1 ? 'padding-top-20' : 'padding-top-10', multiQigLockResult: item}));
                });
                successfullyLockedQigs = (React.createElement("div", {className: 'padding-bottom-20', id: 'multi-qig-lock-result-success-item-list'}, React.createElement("p", {id: 'multilock-examiner-lock-execution-sucess'}, localeStore.instance.
                    TranslateText('team-management.multilock-examiner-lock-execution-sucess-header-text')), successfullock));
            }
            // Bind failed multi Qig lock list
            itemCount = 0;
            if (failureLockList && failureLockList.count() > 0) {
                var lockFailedQigItems = failureLockList.map(function (item) {
                    itemCount++;
                    return (React.createElement(MultiQigLockResultItem, {id: 'multi-qig-lock-result-failed-item-' + itemCount, key: 'multi-qig-lock-result-failed-item-key-' + itemCount, className: itemCount === 1 ? 'padding-top-20' : 'padding-top-10', multiQigLockResult: item}));
                });
                lockFailedQigs = (React.createElement("div", {className: 'padding-bottom-20', id: 'multi-qig-lock-result-failed-item-list'}, React.createElement("p", {id: 'multilock-examiner-lock-execution-failure-header'}, localeStore.instance.
                    TranslateText('team-management.multilock-examiner-lock-execution-failure-header-text')), lockFailedQigItems));
            }
        }
        multiLockResultPopup = multiLockAvailable ?
            (React.createElement("div", {className: className, id: 'qig-lock-status', role: 'dialog', "aria-labelledby": 'popup4Title', "aria-describedby": 'popup4Desc'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'multilock-examiner-lock-execution-header'}, localeStore.instance.
                TranslateText('team-management.multilock-examiner-lock-execution-header-text'))), React.createElement("div", {className: 'popup-content', id: 'popup14Desc'}, successfullyLockedQigs, lockFailedQigs), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("div", {className: 'shift-right'}, React.createElement("div", {className: 'shift-right'}, React.createElement(GenericButton, {id: 'button-primary-rounded-lock-result-ok-button', key: 'key-button-primary-rounded-lock-result-ok-button', className: 'button primary rounded', title: localeStore.instance.
                TranslateText('team-management.multilock-examiner-lock-execution-ok-button-text'), content: localeStore.instance.
                TranslateText('team-management.multilock-examiner-lock-execution-ok-button-text'), disabled: false, onClick: this.okOnClick}))))))) : null;
        return (multiLockResultPopup);
    };
    /**
     * componentDidMount React lifecycle event
     */
    MultiQigLockResultPopup.prototype.componentDidMount = function () {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED, this.onMultiQigLockResultLoad);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    MultiQigLockResultPopup.prototype.componentWillUnmount = function () {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED, this.onMultiQigLockResultLoad);
    };
    return MultiQigLockResultPopup;
}(pureRenderComponent));
module.exports = MultiQigLockResultPopup;
//# sourceMappingURL=multiqiglockresultpopup.js.map