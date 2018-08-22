"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var Header = require('../header');
var Footer = require('../footer');
var enums = require('../utility/enums');
var userInfoStore = require('../../stores/userinfo/userinfostore');
/**
 * React component for reports
 */
var ReportsWrapper = (function (_super) {
    __extends(ReportsWrapper, _super);
    /**
     * Constructor for ReportsWrapper class
     */
    function ReportsWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: true });
        };
        /**
         * Reseting the confirmation dialog's state to make it invisible.
         */
        this.resetLogoutConfirmationStatus = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: false });
        };
        this.state = {
            isLogoutConfirmationPopupDisplaying: false
        };
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
    }
    /**
     * Rendering class
     */
    ReportsWrapper.prototype.render = function () {
        var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, containerPage: enums.PageContainers.Reports}));
        var footer = (React.createElement(Footer, {selectedLanguage: this.props.selectedLanguage, id: 'footer_reports', key: 'footer_reports_key', footerType: enums.FooterType.Reports, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationStatus}));
        return (React.createElement("div", {className: 'reports-wrapper'}, header, React.createElement("div", {className: 'content-wrapper'}, React.createElement("iframe", {id: 'reportsframe', className: 'report-frame', src: config.general.AI_URL})), footer));
    };
    /**
     * Subscribe to language change event
     */
    ReportsWrapper.prototype.componentDidMount = function () {
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        this.props.reportsDidMount();
    };
    /**
     * Unsubscribe language change event
     */
    ReportsWrapper.prototype.componentWillUnmount = function () {
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
    };
    return ReportsWrapper;
}(pureRenderComponent));
module.exports = ReportsWrapper;
//# sourceMappingURL=reportswrapper.js.map