"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var Header = require('../header');
var enums = require('../utility/enums');
var classNames = require('classnames');
var localeStore = require('../../stores/locale/localestore');
var GenericButton = require('../utility/genericbutton');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../utility/sorting/sorthelper');
var Immutable = require('immutable');
var navigationHelper = require('../utility/navigation/navigationhelper');
var AdminSupportTableWrapper = require('./adminsupporttablewrapper');
var adminSupportHelperBase = require('../utility/grid/adminsupporthelpers/adminsupporthelperbase');
var adminSupportStore = require('../../stores/adminsupport/adminsupportstore');
var adminsupportActionCreator = require('../../actions/adminsupport/supportadminactioncreator');
var loginActionCreator = require('../../actions/login/loginactioncreator');
var loginStore = require('../../stores/login/loginstore');
var SearchPanel = require('../utility/search/searchpanel');
var navigationStore = require('../../stores/navigation/navigationstore');
/**
 * React component class for Login
 */
var AdminSupport = (function (_super) {
    __extends(AdminSupport, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function AdminSupport(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.supportExaminerSelectionEnabled = false;
        this._examinerSelected = false;
        this.searchData = { isVisible: true, isSearching: false, searchText: '' };
        /* Called when search text changed */
        this.onSearch = function (searchText) {
            _this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
            _this.filteredExaminers();
            if (adminSupportStore.instance.getExaminerID) {
                loginActionCreator.selectExaminer(0);
            }
        };
        /**
         * Loading examiner data for admin support
         */
        this.loadSupportAdminExaminerData = function () {
            if (adminSupportStore &&
                adminSupportStore.instance.getSupportAdminExaminerLists &&
                adminSupportStore.instance.adminSupportSortDetails.length <= 0) {
                var sortDetails = {
                    comparerName: comparerList.adminSupportNameComparer,
                    sortDirection: enums.SortDirection.Ascending
                };
                adminsupportActionCreator.onSortedClick(sortDetails);
                _this.comparerName = comparerList[sortDetails.comparerName].toString();
                _this.sortDirection = sortDetails.sortDirection;
            }
            _this.setState({
                renderedOn: Date.now(),
                isLiveSelected: false,
                doDisableLogin: !_this._examinerSelected
            });
            // Remove adminsupport key from windows session storage so that admin support page will not be loaded on refresh.
            window.sessionStorage.removeItem('adminsupport');
        };
        /* select examiner in support enviornment grid */
        this.selectExaminerInSupportEnviornmentGrid = function () {
            var supportadminlist = adminSupportStore.instance.getSupportAdminExaminerLists;
            _this.supportExaminerSelectionEnabled = _this._examinerSelected =
                supportadminlist.getSupportExaminerList ?
                    supportadminlist.getSupportExaminerList.some(function (item) { return item.isSelected; }) : false;
            _this.setState({
                renderedOn: Date.now(),
                doDisableLogin: !_this._examinerSelected && !_this.state.isLiveSelected
            });
        };
        this.state = {
            renderedOn: Date.now(),
            isLiveSelected: false,
            doDisableLogin: true
        };
        this.onClick = this.onClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.adminSupportHelper = new adminSupportHelperBase();
        this.loadSupportAdminExaminerData = this.loadSupportAdminExaminerData.bind(this);
        this.onSortClick = this.onSortClick.bind(this);
        this.filteredData = adminSupportStore.instance.getSupportAdminExaminerLists;
    }
    /**
     * component will Mount event
     */
    AdminSupport.prototype.componentWillMount = function () {
        adminsupportActionCreator.getSupportAdminExaminerLists();
    };
    /**
     * Render
     */
    AdminSupport.prototype.render = function () {
        var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, isInTeamManagement: false, renderedOn: this.state.renderedOn, containerPage: enums.PageContainers.AdminSupport}));
        var loginButton = (React.createElement(GenericButton, {id: 'env-login-btn', key: 'key_complete_button', onClick: this.onClick, disabled: this.state.doDisableLogin, content: localeStore.instance.TranslateText('support-login.support-login-page.login-button-text'), className: 'primary rounded compose-msg popup-nav', title: localeStore.instance.TranslateText('support-login.support-login-page.login-button-text')}));
        var cancelButton;
        var pageTitle;
        var pageContent;
        if (navigationStore.instance.isFromSwitchUser) {
            cancelButton = (React.createElement(GenericButton, {id: 'button-rounded-cancel-button', key: 'key-button-rounded-cancel-button', className: 'rounded', title: localeStore.instance.TranslateText('support-login.support-login-page.cancel-button-text'), content: localeStore.instance.TranslateText('support-login.support-login-page.cancel-button-text'), disabled: false, onClick: this.onCancelClick}));
            pageTitle = localeStore.instance.TranslateText('support-login.support-login-page.page-title-switch-user');
            pageContent = localeStore.instance.TranslateText('support-login.support-login-page.content-switch-user');
        }
        else {
            pageTitle = localeStore.instance.TranslateText('support-login.support-login-page.page-title');
            pageContent = localeStore.instance.TranslateText('support-login.support-login-page.content');
        }
        var data = adminSupportStore.instance.getSupportAdminExaminerLists;
        this._comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
        this.searchData.isSearching = this.searchData.searchText !== '';
        if (data !== undefined && this.searchData.isSearching && !this.state.isLiveSelected) {
            this.searchinSupportTable(data, this._comparerName);
            data = { getSupportExaminerList: this.filteredData.getSupportExaminerList };
            this.searchData.isSearching = false;
        }
        if (data !== undefined && this.comparerName !== undefined && !this.supportExaminerSelectionEnabled) {
            data.getSupportExaminerList = Immutable.List(sortHelper.sort(data.getSupportExaminerList.toArray(), comparerList[this._comparerName]));
        }
        else {
            this.supportExaminerSelectionEnabled = false;
        }
        var supportAdminTable = data ? (React.createElement(AdminSupportTableWrapper, {columnHeaderRows: this.getGridColumnHeaderRows(this.comparerName, this.sortDirection), gridRows: this.adminSupportHelper.generateExaminersRowDefinition(data), onSortClick: this.onSortClick, id: this.props.id, renderedOn: this.state.renderedOn})) : null;
        return (React.createElement("div", {className: 'env-login-wrapper'}, header, React.createElement("div", {className: 'content-wrapper'}, React.createElement("div", {className: 'column-right'}, React.createElement("div", {className: 'wrapper'}, React.createElement("div", {className: 'clearfix'}, React.createElement("h3", {className: 'shift-left page-title padding-top-25 padding-bottom-15', id: 'support_login_header'}, React.createElement("span", {className: 'page-title-text'}, pageTitle), React.createElement("span", {className: 'right-spacer'}))), React.createElement("div", {className: 'message-bar', id: 'support_login_messagebar'}, React.createElement("span", {className: 'message-content'}, pageContent)), this.renderOptionButtons(), this.renderSearchPanel(), React.createElement("div", {id: 'support_enviornment_grid', className: classNames('grid-holder grid-view selectable-grid padding-top-15', { 'disabled': this.state.isLiveSelected })}, React.createElement("div", {className: 'grid-wrapper'}, supportAdminTable)), React.createElement("div", {className: 'footer-holder padding-top-10 padding-bottom-20'}, cancelButton, loginButton))))));
    };
    /**
     * Perform search in Support Table
     * @param data
     * @param _comparerName
     */
    AdminSupport.prototype.searchinSupportTable = function (data, _comparerName) {
        var _this = this;
        this.filteredData = JSON.parse(JSON.stringify(data));
        if (this.filteredData) {
            if (this.searchData.searchText !== '') {
                var filterSearchArray = this.searchData.searchText.toLowerCase().split('');
                this.filteredData.getSupportExaminerList = Immutable.List(this.filteredData.getSupportExaminerList
                    .filter(function (examiner) {
                    return ((examiner.initials.toLowerCase() + ' ' + examiner.surname.toLowerCase())
                        .indexOf(_this.searchData.searchText.toLowerCase()) !== -1) ||
                        (examiner.initials.toLowerCase()
                            .indexOf(_this.searchData.searchText.toLowerCase()) !== -1) ||
                        (examiner.surname.toLowerCase()
                            .indexOf(_this.searchData.searchText.toLowerCase()) !== -1) || (examiner.liveUserName.toLowerCase()
                        .indexOf(_this.searchData.searchText.toLowerCase()) !== -1) ||
                        (examiner.employeeNum.toLowerCase()
                            .indexOf(_this.searchData.searchText.toLowerCase()) !== -1);
                }));
            }
            else {
                this.filteredData.getSupportExaminerList = Immutable.List(this.filteredData.getSupportExaminerList);
            }
            if (this.comparerName !== undefined) {
                this.filteredData.getSupportExaminerList = Immutable.List(sortHelper
                    .sort(this.filteredData.getSupportExaminerList.toArray(), comparerList[_comparerName]));
            }
        }
    };
    /**
     * Render the search panel in support enviornment login
     */
    AdminSupport.prototype.renderSearchPanel = function () {
        var disable = false;
        if (this.state.isLiveSelected) {
            this.searchData.searchText = '';
            disable = true;
        }
        return (React.createElement("div", {className: 'search-box-wrap env-search-wrap padding-top-15'}, React.createElement(SearchPanel, {id: 'search-panel', key: 'search-panel-key', searchData: this.searchData, onSearch: this.onSearch, isSearchResultTextVisible: false, isdisable: disable, searchResultsFor: '', searchPlaceHolder: localeStore.instance.
            TranslateText('support-login.support-login-search.search-placeholder'), searchTooltip: '', searchCancel: localeStore.instance.
            TranslateText('support-login.support-login-search.close'), searchClassName: 'search-box-panel', searchWrapClass: ''})));
    };
    /**
     * Re render the page after applied the filter.
     */
    AdminSupport.prototype.filteredExaminers = function () {
        this.setState({
            renderedOn: Date.now()
        });
    };
    /**
     * Method to render the option buttons
     */
    AdminSupport.prototype.renderOptionButtons = function () {
        if (!navigationStore.instance.isFromSwitchUser) {
            return (React.createElement("div", {className: 'login-options-holder padding-top-10 padding-bottom-20'}, React.createElement("ul", {className: 'option-items', id: 'support_login_options'}, React.createElement("li", {className: 'padding-top-10'}, React.createElement("input", {type: 'radio', id: 'loginLiveEnv', name: 'loginEnv', checked: this.state.isLiveSelected ? true : false}), React.createElement("label", {htmlFor: 'loginLiveEnv', id: 'loginLiveEnv_label', onClick: this.onOptionButtonClick.bind(this, true)}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text font-bold'}, localeStore.instance.TranslateText('support-login.support-login-page.radio-button-text-live')))), React.createElement("li", {className: 'padding-top-10'}, React.createElement("input", {type: 'radio', value: 'selected', id: 'loginsupportEnv', name: 'loginEnv', checked: this.state.isLiveSelected ? false : true}), React.createElement("label", {htmlFor: 'loginsupportEnv', id: 'loginsupportEnv_label', onClick: this.onOptionButtonClick.bind(this, false)}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, localeStore.instance.TranslateText('support-login.support-login-page.radio-button-text-support')))))));
        }
    };
    /**
     * Method to handle the support login click event
     */
    AdminSupport.prototype.onClick = function () {
        if (this.state.isLiveSelected) {
            // Login to the live environment as myself.
            navigationHelper.navigateToQigSelector('false');
        }
        else {
            var supportadminlist = adminSupportStore.instance.getSupportAdminExaminerLists;
            var _examinerId_1 = 0;
            var _liveUserName_1;
            if (supportadminlist.getSupportExaminerList) {
                supportadminlist.getSupportExaminerList.map(function (item) {
                    //Check any examiner in support enviornment is selected and retrive liveUsername and examinerId
                    if (item.isSelected) {
                        _liveUserName_1 = item.liveUserName;
                        _examinerId_1 = item.examinerId;
                    }
                    item.isSelected = false;
                });
                // Login to the support environment as a selected examiner.
                if (_examinerId_1 > 0 && _liveUserName_1) {
                    loginActionCreator.supportLogin(_liveUserName_1, _examinerId_1);
                }
            }
        }
    };
    /**
     * Method to handle the support cancel button click event
     */
    AdminSupport.prototype.onCancelClick = function () {
        navigationHelper.navigateToQigSelector('false');
    };
    /**
     * Method to handle option button click
     * @param isLiveSelected
     */
    AdminSupport.prototype.onOptionButtonClick = function (isLiveSelected) {
        //reset the selection in examiner list
        if (this._examinerSelected && isLiveSelected) {
            loginActionCreator.selectExaminer(0);
            this._examinerSelected = false;
        }
        this.setState({
            renderedOn: Date.now(),
            isLiveSelected: isLiveSelected,
            doDisableLogin: !isLiveSelected && !this._examinerSelected
        });
    };
    /**
     * Call back function from table wrapper on sorting
     * @param comparerName
     * @param sortDirection
     */
    AdminSupport.prototype.onSortClick = function (comparerName, sortDirection) {
        this.comparerName = comparerName;
        this.sortDirection = sortDirection;
        var sortDetails = {
            comparerName: comparerList[this.comparerName],
            sortDirection: this.sortDirection
        };
        adminsupportActionCreator.onSortedClick(sortDetails);
    };
    /**
     * componentDidMount React lifecycle event
     */
    AdminSupport.prototype.componentDidMount = function () {
        adminSupportStore.instance.addListener(adminSupportStore.AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT, this.loadSupportAdminExaminerData);
        adminSupportStore.instance.addListener(adminSupportStore.AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT, this.loadSupportAdminExaminerData);
        adminSupportStore.instance.addListener(adminSupportStore.AdminSupportStore.EXAMINER_SELECTED_EVENT, this.selectExaminerInSupportEnviornmentGrid);
        loginStore.instance.addListener(loginStore.LoginStore.SUPPORT_LOGIN_EVENT, this.navigate);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    AdminSupport.prototype.componentWillUnmount = function () {
        adminSupportStore.instance.removeListener(adminSupportStore.AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT, this.loadSupportAdminExaminerData);
        adminSupportStore.instance.removeListener(adminSupportStore.AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT, this.loadSupportAdminExaminerData);
        adminSupportStore.instance.removeListener(adminSupportStore.AdminSupportStore.EXAMINER_SELECTED_EVENT, this.selectExaminerInSupportEnviornmentGrid);
        loginStore.instance.removeListener(loginStore.LoginStore.SUPPORT_LOGIN_EVENT, this.navigate);
    };
    /**
     * navigate to qig selector
     */
    AdminSupport.prototype.navigate = function () {
        navigationHelper.navigateToQigSelector('false');
    };
    /**
     * Generating Grid Rows
     * @param comparerName
     * @param sortDirection
     */
    AdminSupport.prototype.getGridColumnHeaderRows = function (comparerName, sortDirection) {
        return this.adminSupportHelper.generateTableHeader(comparerName, sortDirection);
    };
    return AdminSupport;
}(pureRenderComponent));
module.exports = AdminSupport;
//# sourceMappingURL=adminsupport.js.map