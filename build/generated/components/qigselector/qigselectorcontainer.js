"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var Header = require('../header');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var localeStore = require('../../stores/locale/localestore');
var busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
var classNames = require('classnames');
var GenericDialog = require('../utility/genericdialog');
var Footer = require('../footer');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var QigSelector = require('./qigselector');
var stringHelper = require('../../utility/generic/stringhelper');
/**
 * React component for team management
 */
var QigSelectorContainer = (function (_super) {
    __extends(QigSelectorContainer, _super);
    /**
     * @constructor
     */
    function QigSelectorContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Show busy indicator when submit is clicked in live open worklist
         */
        this.setBusyIndicator = function () {
            /* if any error occurs set the variable to false and content refresh has started */
            if (busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none &&
                _this.isContentRefreshStarted) {
                _this.resetContentRefreshStatuses();
            }
            _this.setState({
                isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none ? false : true
            });
        };
        /**
         * Fires after email save
         */
        this.userInfoSaved = function () {
            _this.setState({
                isSaveEmailMessageDisplaying: true
            });
        };
        /**
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: true });
        };
        this.state = {
            isSaveEmailMessageDisplaying: false,
        };
        this.onOkClickOfEmailSucessMessage = this.onOkClickOfEmailSucessMessage.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
    }
    /**
     * Subscribe to language change event
     */
    QigSelectorContainer.prototype.componentDidMount = function () {
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
    };
    /**
     * Unsubscribe language change event
     */
    QigSelectorContainer.prototype.componentWillUnmount = function () {
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
    };
    /**
     * Render method
     */
    QigSelectorContainer.prototype.render = function () {
        var saveEmailMessage = stringHelper.format(localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.body'), [String(String.fromCharCode(179))]);
        var emailSaveMessage = (React.createElement(GenericDialog, {content: saveEmailMessage, header: localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.header'), displayPopup: this.state.isSaveEmailMessageDisplaying, okButtonText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button'), onOkClick: this.onOkClickOfEmailSucessMessage, id: 'emailSaveMessage', key: 'emailSaveMessage', popupDialogType: enums.PopupDialogType.ResponseAllocationError}));
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'busyIndicator', key: 'busyIndicator', isBusy: this.state.isBusy, busyIndicatorInvoker: busyIndicatorStore.instance.getBusyIndicatorInvoker}));
        var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, isInTeamManagement: true, containerPage: enums.PageContainers.QigSelector}));
        var footer = (React.createElement(Footer, {selectedLanguage: this.props.selectedLanguage, id: 'footer_team_mgmt', key: 'footer_team_mgmt', footerType: enums.FooterType.TeamManagement, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationSatus}));
        return (React.createElement("div", {className: classNames('qig-page-wrapper')}, header, footer, emailSaveMessage, React.createElement(QigSelector, {containerPage: enums.PageContainers.QigSelector, isNavigatedAfterFromLogin: this.props.isNavigatedAfterFromLogin, selectedLanguage: this.props.selectedLanguage})));
    };
    /**
     * Subscribing component updated event.
     */
    QigSelectorContainer.prototype.componentDidUpdate = function () {
        /*In Qig Selector lock popup offline scenario, isBusy will come as undefined so
        changing the condition */
        if (this.state.isBusy === true) {
            this.props.setOfflineContainer(true);
        }
    };
    /**
     * Reset content refresh statuses
     */
    QigSelectorContainer.prototype.resetContentRefreshStatuses = function () {
        this.isContentRefreshStarted = false;
    };
    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    QigSelectorContainer.prototype.resetLogoutConfirmationSatus = function () {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    };
    /**
     * Email save success message ok click
     */
    QigSelectorContainer.prototype.onOkClickOfEmailSucessMessage = function () {
        this.setState({
            isSaveEmailMessageDisplaying: false
        });
    };
    return QigSelectorContainer;
}(pureRenderComponent));
module.exports = QigSelectorContainer;
//# sourceMappingURL=qigselectorcontainer.js.map