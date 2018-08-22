"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var classNames = require('classnames');
var pureRenderComponent = require('../base/purerendercomponent');
var MultiQigLockItem = require('./multiqiglockitem');
var localeStore = require('../../stores/locale/localestore');
var GenericButton = require('../utility/genericbutton');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var GenericCheckbox = require('../utility/genericcheckbox');
var stringHelper = require('../../utility/generic/stringhelper');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var Immutable = require('immutable');
var enums = require('../utility/enums');
var busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
var applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
/**
 * React wrapper component for multi qig lock popup
 */
var MultiQigLockPopup = (function (_super) {
    __extends(MultiQigLockPopup, _super);
    /**
     * @constructor
     */
    function MultiQigLockPopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isShowMultiLockPopup = false;
        /**
         * Method to cancel the multi lock action and hide multi lock popup.
         */
        this.cancelMultiLockAction = function () {
            if (!applicationactioncreator.checkActionInterrupted()) {
                return;
            }
            _this.isShowMultiLockPopup = false;
            // Invoke help examiner data retrieve action for getting refreshed data and update the store.
            teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
            // Invoke team over view count.
            teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
            // Navigate to help examiner worklist after completed the lock operation.
            if (_this.examinerDrillDownData) {
                teamManagementActionCreator.updateExaminerDrillDownData(_this.examinerDrillDownData);
            }
            // Invoke method to clear the multi lock data.
            teamManagementActionCreator.resetMultiLockData();
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingResponse);
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to execute multi lock action and hide multi lock popup.
         */
        this.executeMultiLockAction = function () {
            if (!applicationactioncreator.checkActionInterrupted()) {
                return;
            }
            /* Execute multiple lock action */
            _this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
            if (_this.multiQigLockData) {
                var dataCollection_1 = new Array();
                _this.multiQigLockData.map(function (item) {
                    if (item.isChecked) {
                        var examinerSEPAction = {
                            examinerRoleId: item.examinerRoleId,
                            markSchemeGroupId: item.markSchemeGroupId,
                            requestedByExaminerRoleId: item.loggedInExaminerRoleId
                        };
                        dataCollection_1.push(examinerSEPAction);
                    }
                });
                var examinerForSEPActions = Immutable.List(dataCollection_1);
                var doSEPApprovalManagementActionArgument = {
                    actionIdentifier: enums.SEPAction.Lock,
                    examiners: examinerForSEPActions
                };
                teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument, true);
                _this.isShowMultiLockPopup = false;
                busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingResponse);
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * update multi qig lock selection
         */
        this.updateMultiQigLockSelection = function (markSchemeGroupId, isSelectedAll) {
            teamManagementActionCreator.updateMultiQigLockSelection(markSchemeGroupId, isSelectedAll);
        };
        /**
         * This method will call on multi lock data load
         */
        this.onMultiLockDataLoad = function (selectedExaminerId, selectedQigId, selectedExaminerRoleId, selectedQigName) {
            if (teamManagementStore.instance.multiLockDataList &&
                teamManagementStore.instance.multiLockDataList.count() > 0) {
                // Get selected help examiner name.
                _this.getSelectedExaminerName(selectedExaminerId, selectedQigName);
                var qigNames = [selectedQigName];
                // Format the selected Qig name.
                _this.selectedQigName = stringHelper.format(localeStore.
                    instance.TranslateText('team-management.multilock-examiner-lockby-text'), qigNames);
                _this.isShowMultiLockPopup = true;
                _this.examinerDrillDownData = { examinerId: selectedExaminerId, examinerRoleId: selectedExaminerRoleId };
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This method will call on multi qig lock selection received
         */
        this.updateMultiLockQigSelectionReceived = function () {
            _this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
            _this.isLockButtonEnabled = false;
            _this.isSelectedAll = false;
            if (_this.multiQigLockData) {
                var selectedlockData = _this.multiQigLockData.filter(function (item) {
                    return item.isChecked === true;
                });
                _this.isLockButtonEnabled = selectedlockData && selectedlockData.count() > 0;
                _this.isSelectedAll = selectedlockData && selectedlockData.count() > 0 &&
                    _this.multiQigLockData.count() === selectedlockData.count();
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            renderedOn: 0
        };
        this.isShowMultiLockPopup = false;
        this.isLockButtonEnabled = false;
        this.isSelectedAll = false;
        this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
    }
    /**
     * Render method
     */
    MultiQigLockPopup.prototype.render = function () {
        this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
        var multiQigLockItems;
        var multiQigLockPopup;
        var itemCount = 0;
        var that = this;
        var isMultiLockAvailable = this.multiQigLockData && this.multiQigLockData.count() > 0;
        if (isMultiLockAvailable) {
            // Sort multi qig lock data in the ascending order of Qig name it is similar to qig selector list.
            this.multiQigLockData = Immutable.List(sortHelper.
                sort(this.multiQigLockData.toArray(), comparerList.MultiLockListComparer));
            multiQigLockItems = this.multiQigLockData.map(function (item) {
                itemCount++;
                return (React.createElement(MultiQigLockItem, {id: 'multi-qig-lock-item-' + itemCount, key: 'multi-qig-lock-item-key-' + itemCount, multiQigLockData: item}));
            });
        }
        multiQigLockPopup = isMultiLockAvailable ? (React.createElement("div", {className: classNames('popup medium popup-overlay qig-lock fixed-hf', this.isShowMultiLockPopup ? 'open' : 'close'), id: 'qig-lock', role: 'dialog', "aria-labelledby": 'popup4Title', "aria-describedby": 'popup4Desc'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup4Title border-right: ;'}, localeStore.instance.
            TranslateText('team-management.multilock-examiner-header-text'))), React.createElement("div", {className: 'popup-content', id: 'popup14Desc'}, React.createElement("p", {id: 'multi-qig-lock-selected-examiner'}, this.selectedExaminerName), React.createElement("p", {id: 'multi-qig-lock-help-decription'}, localeStore.instance.
            TranslateText('team-management.multilock-examiner-help-description')), React.createElement(GenericCheckbox, {id: 'multi-qig-lock-item-default', key: 'multi-qig-lock-item-default-key', containerClassName: 'padding-top-20', className: 'text-middle checkbox', disabled: true, isChecked: true, labelClassName: 'text-middle', labelContent: this.selectedQigName}), multiQigLockItems), React.createElement("div", {className: 'popup-footer text-right padding-top-20'}, React.createElement(GenericCheckbox, {id: 'multi-qig-lock-item-select-all', key: 'multi-qig-lock-item-select-key', containerClassName: 'shift-left', className: 'text-middle checkbox', disabled: false, isChecked: this.isSelectedAll, labelClassName: 'text-middle lock-chk-all', labelContent: localeStore.instance.TranslateText('team-management.multilock-examiner-select-all-text'), onSelectionChange: this.updateMultiQigLockSelection.bind(this, 0, !this.isSelectedAll)}), React.createElement("div", {className: 'shift-right'}, React.createElement(GenericButton, {id: 'button-rounded-cancel-button', key: 'key_button rounded cancel-button', className: 'button rounded close-button', title: localeStore.instance.TranslateText('team-management.multilock-examiner-cancel-button-text'), content: localeStore.instance.TranslateText('team-management.multilock-examiner-cancel-button-text'), disabled: false, onClick: this.cancelMultiLockAction}), React.createElement(GenericButton, {id: 'button-primary-rounded-lock-button', key: 'key_button primary rounded-lock-button', className: 'button primary rounded', title: localeStore.instance.TranslateText('team-management.multilock-examiner-lock-button-text'), content: localeStore.instance.TranslateText('team-management.multilock-examiner-lock-button-text'), disabled: !this.isLockButtonEnabled, onClick: this.executeMultiLockAction})))))) : null;
        return (multiQigLockPopup);
    };
    /**
     * componentDidMount React lifecycle event
     */
    MultiQigLockPopup.prototype.componentDidMount = function () {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED, this.onMultiLockDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED, this.updateMultiLockQigSelectionReceived);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    MultiQigLockPopup.prototype.componentWillUnmount = function () {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED, this.onMultiLockDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED, this.updateMultiLockQigSelectionReceived);
    };
    /**
     * Get the selecetd examiner name.
     */
    MultiQigLockPopup.prototype.getSelectedExaminerName = function (selectedExaminerId, selectedQigName) {
        if (teamManagementStore.instance.examinersForHelpExaminers) {
            var _helpExaminerData = teamManagementStore.instance.examinersForHelpExaminers;
            var examinerName_1;
            _helpExaminerData.map(function (item) {
                if (item.examinerId === selectedExaminerId) {
                    examinerName_1 = stringFormatHelper.
                        getFormattedExaminerName(item.initials, item.surname);
                }
            });
            var examinerNames = [examinerName_1, selectedQigName];
            this.selectedExaminerName = stringHelper.format(localeStore.
                instance.TranslateText('team-management.multilock-examiner-help-text'), examinerNames);
        }
    };
    return MultiQigLockPopup;
}(pureRenderComponent));
module.exports = MultiQigLockPopup;
//# sourceMappingURL=multiqiglockpopup.js.map