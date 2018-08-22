"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var enums = require('../utility/enums');
var classNames = require('classnames');
var pureRenderComponent = require('../base/purerendercomponent');
var MultiQigItem = require('./multiqigitem');
var localeStore = require('../../stores/locale/localestore');
var qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var Promise = require('es6-promise');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
var busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
var MultiQigNavigationConfirmationDialog = require('./multiqignavigationconfirmationdialog');
var applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
var domManager = require('../../utility/generic/domhelper');
/**
 * React wrapper component for multi qig drop down
 */
var MultiQigDropDown = (function (_super) {
    __extends(MultiQigDropDown, _super);
    /**
     * @constructor
     */
    function MultiQigDropDown(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.storageAdapterHelper = new storageAdapterHelper();
        this._boundHandleOnClick = null;
        this.isSelectedItemClicked = false;
        /*
         * Invoked when the data received for Help Examiners tab.
         */
        this.onHelpExaminersDataReceived = function (isFromHistory) {
            if (isFromHistory === void 0) { isFromHistory = false; }
            if (isFromHistory) {
                return;
            }
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
            _this.setState({
                renderedOn: Date.now(),
                isBusy: false
            });
        };
        this.onQigSelectedFromMuliQigDropDown = function () {
            if (!applicationactioncreator.checkActionInterrupted()) {
                return;
            }
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingQigDetailsFromMultiQig);
            _this.storageAdapterHelper.clearTeamDataCache(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            _this.storageAdapterHelper.clearTeamDataCache(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true);
            qigActionCreator.getQIGSelectorData(teamManagementStore.instance.multiQigSelectedDetail.qigId, true, false, false, false, true, true);
            _this.doShowMultiQigDropDown = false;
            _this.isShowingQigSelectionPopup = false;
            _this.setState({
                renderedOn: Date.now(),
                isBusy: true
            });
        };
        /**
         * Method to be invoked when a QIG is selected/opened from the QIG Selector list
         */
        this.onQIGSelected = function (isDataFromSearch, isDataFromHistory, isFromLocksInPopUp) {
            if (isDataFromSearch === void 0) { isDataFromSearch = false; }
            if (isDataFromHistory === void 0) { isDataFromHistory = false; }
            if (isFromLocksInPopUp === void 0) { isFromLocksInPopUp = false; }
            if (!isFromLocksInPopUp && !isDataFromSearch && !isDataFromHistory) {
                // if the qig in user option is withdrawn then select the entire qig data.
                if (qigStore.instance.selectedQIGForMarkerOperation) {
                    var markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, true);
                    var openTeamManagementPromise = teamManagementActionCreator.openTeamManagement(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, false, true);
                    var that = _this;
                    Promise.Promise.all([
                        markSchemeGroupCCPromise,
                        openTeamManagementPromise
                    ]).
                        then(function (result) {
                        teamManagementActionCreator.GetHelpExminersData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false);
                    });
                }
            }
        };
        /**
         * Method for handle Qig selection.
         */
        this.onClickMultiQigDropDown = function (qigDetail) {
            if (!applicationactioncreator.checkActionInterrupted()) {
                return;
            }
            _this.selectedQig = qigDetail;
            if (qigDetail.examinerLockCount <= 0 && qigDetail.examinerStuckCount <= 0) {
                _this.isShowingQigSelectionPopup = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            else {
                teamManagementActionCreator.qigSelectedFromMultiQigDropDown(qigDetail);
            }
        };
        /**
         * Method for handle toggle action in QIg selection.
         */
        this.toggleQigSelectionPopup = function () {
            _this.isSelectedItemClicked = true;
            _this.doShowMultiQigDropDown = _this.doShowMultiQigDropDown === undefined ? true :
                !_this.doShowMultiQigDropDown;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * handle different popup actions
         */
        this.handlePopUpAction = function (popUpActionType) {
            switch (popUpActionType) {
                case enums.PopUpActionType.Yes:
                    teamManagementActionCreator.qigSelectedFromMultiQigDropDown(_this.selectedQig);
                    break;
                case enums.PopUpActionType.No:
                    _this.doShowMultiQigDropDown = !_this.doShowMultiQigDropDown;
                    _this.isShowingQigSelectionPopup = false;
                    _this.setState({
                        renderedOn: Date.now()
                    });
                    break;
            }
        };
        /**
         * Handle click events on the window and collapse multi qig selection dropdown
         * @param {any} source - The source element
         */
        this.handleOnClick = function (e) {
            /** check if the clicked element is a child of the multi qig list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'multiqig-dropdown-helpexaminer-container'; }) == null) {
                if (!_this.isSelectedItemClicked &&
                    (_this.doShowMultiQigDropDown !== undefined && _this.doShowMultiQigDropDown)) {
                    // collapse the multi qig dropdown
                    _this.doShowMultiQigDropDown = false;
                    _this.setState({ renderedOn: Date.now() });
                }
            }
            else {
                _this.isSelectedItemClicked = false;
            }
        };
        this.state = {
            renderedOn: 0,
            isBusy: false
        };
        this.isShowingQigSelectionPopup = false;
        this.doShowMultiQigDropDown = undefined;
        this.selectedQig = undefined;
        this._boundHandleOnClick = this.handleOnClick.bind(this);
    }
    /**
     * Render method
     */
    MultiQigDropDown.prototype.render = function () {
        var qigName = teamManagementStore.instance.multiQigSelectedDetail ?
            teamManagementStore.instance.multiQigSelectedDetail.qigName : localeStore.instance.
            TranslateText('team-management.multiqig-selecteditem-default-text');
        var multiQigItems;
        if (this.props.multiQigItemList) {
            var itemCount_1 = 0;
            var that_1 = this;
            multiQigItems = this.props.multiQigItemList.map(function (qigDetail) {
                itemCount_1++;
                return (React.createElement(MultiQigItem, {id: 'multiQig_Item_' + itemCount_1, key: 'multiQig_Item_Key_' + itemCount_1, multiQigData: qigDetail, onQigSelected: that_1.onClickMultiQigDropDown}));
            });
        }
        var showPopUpOnMultiQigSelection = this.isShowingQigSelectionPopup ?
            (React.createElement(MultiQigNavigationConfirmationDialog, {id: 'multiQigNavigationConfirmationDialog', key: 'multiQigNavigationConfirmationDialog-key', content: localeStore.instance.TranslateText('team-management.multi-qig.help-examiner-multi-qig-popup-content'), header: localeStore.instance.TranslateText('team-management.multi-qig.help-examiner-multi-qig-popup-header'), noButtonText: localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.yes-button'), onYesClick: this.handlePopUpAction.bind(this, enums.PopUpActionType.Yes), onNoClick: this.handlePopUpAction.bind(this, enums.PopUpActionType.No)})) : null;
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'busyIndicator', key: 'busyIndicator', isBusy: this.state.isBusy, busyIndicatorInvoker: busyIndicatorStore.instance.getBusyIndicatorInvoker}));
        var className = classNames('dropdown-wrap m-qig-comp', { 'open': this.doShowMultiQigDropDown === true }, { 'close': this.doShowMultiQigDropDown === false });
        var tableStyle = {};
        tableStyle = {
            width: '100%'
        };
        return (React.createElement("div", {className: 'col-wrap grid-nav padding-bottom-15'}, showPopUpOnMultiQigSelection, busyIndicator, React.createElement("div", {className: 'col-3-of-12'}, React.createElement("div", {className: className, id: 'multiqig-dropdown-helpexaminer-container'}, React.createElement("a", {href: '#', className: 'menu-button', onClick: this.toggleQigSelectionPopup, id: 'multiqig-dropdown-helpexaminer'}, React.createElement("span", {className: 'markby-txt', id: 'multiqig-dropdown-default-item'}, qigName, " "), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement("div", {className: 'menu'}, React.createElement("table", {cellSpacing: '0', cellPadding: '0', style: tableStyle, className: 'grid-view-list'}, React.createElement("thead", null, React.createElement("tr", {className: 'row', id: 'multiqig-dropdown-item-header'}, React.createElement("td", null, React.createElement("div", {className: 'item'}, localeStore.instance.
            TranslateText('team-management.multiqig-name-header-text'))), React.createElement("td", null, React.createElement("div", {className: 'item'}, localeStore.instance.
            TranslateText('team-management.multiqig-examiner-lockcount-header-text'))), React.createElement("td", null, React.createElement("div", {className: 'item'}, localeStore.instance.
            TranslateText('team-management.multiqig-examiner-stuckcount-header-text'))))), React.createElement("tbody", {id: 'multiqig-dropdown-item-content'}, multiQigItems)))))));
    };
    /**
     * What happens when the component mounts
     */
    MultiQigDropDown.prototype.componentDidMount = function () {
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN, this.onQigSelectedFromMuliQigDropDown);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.onHelpExaminersDataReceived);
        window.addEventListener('click', this._boundHandleOnClick);
        window.addEventListener('touchend', this._boundHandleOnClick);
    };
    /**
     * What happens when the component unmounts
     */
    MultiQigDropDown.prototype.componentWillUnmount = function () {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN, this.onQigSelectedFromMuliQigDropDown);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.onHelpExaminersDataReceived);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
    };
    return MultiQigDropDown;
}(pureRenderComponent));
module.exports = MultiQigDropDown;
//# sourceMappingURL=multiqigdropdown.js.map