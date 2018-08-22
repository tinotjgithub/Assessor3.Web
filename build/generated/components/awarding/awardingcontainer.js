"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var classNames = require('classnames');
var Header = require('../header');
var Footer = require('../footer');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var userOptionsStore = require('../../stores/useroption/useroptionstore');
var useroptionKeys = require('../../utility/useroption/useroptionkeys');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
var Awarding = require('./awarding');
var AwardingComponentsPanel = require('./awardingcomponentspanel');
/**
 * React component for Awarding Container
 */
var AwardingContainer = (function (_super) {
    __extends(AwardingContainer, _super);
    /**
     * @constructor
     */
    function AwardingContainer(props, state) {
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
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: true });
        };
        /**
         * Handle toggle event of recipient list.
         *
         */
        this.onLeftPanelCollapseOrExpand = function () {
            userOptionsHelper.save(useroptionKeys.AWARDING_LEFT_PANEL_COLLAPSED, String(!_this.state.isLeftPanelCollapsed));
            _this.setState({
                isLeftPanelCollapsed: !_this.state.isLeftPanelCollapsed
            });
        };
        /**
         * Sets the awarding left panel toggle state based on the useroption
         */
        this.onUserOptionsLoaded = function () {
            _this.setState({
                isLeftPanelCollapsed: _this.isAwardingLeftPanelCollapsed
            });
        };
        this.state = {
            isLeftPanelCollapsed: this.isAwardingLeftPanelCollapsed
        };
        this.setBusyIndicator = this.setBusyIndicator.bind(this);
        this.onUserOptionsLoaded = this.onUserOptionsLoaded.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.onLeftPanelCollapseOrExpand = this.onLeftPanelCollapseOrExpand.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
    }
    /**
     * Subscribe to language change event
     */
    AwardingContainer.prototype.componentDidMount = function () {
        /* Initiating action to fetch the componet and session details*/
        awardingActionCreator.getAwardingComponentAndSessionDetails();
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        userOptionsStore.instance.addListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
    };
    /**
     * Unsubscribe language change event
     */
    AwardingContainer.prototype.componentWillUnmount = function () {
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        userOptionsStore.instance.removeListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
    };
    /**
     * Render method
     */
    AwardingContainer.prototype.render = function () {
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'busyIndicator', key: 'busyIndicator', isBusy: this.state.isBusy, busyIndicatorInvoker: enums.BusyIndicatorInvoker.none}));
        var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, renderedOn: this.state.renderedOn, containerPage: enums.PageContainers.Awarding}));
        var footer = (React.createElement(Footer, {id: 'footer_awarding', key: 'footer_awarding_key', selectedLanguage: this.props.selectedLanguage, footerType: enums.FooterType.Awarding, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationSatus}));
        return (React.createElement("div", {className: classNames('awarding-wrapper', this.state.isLeftPanelCollapsed ? 'hide-left' : '')}, header, footer, this.renderDetails(), busyIndicator));
    };
    /**
     * Render the details for the awarding
     */
    AwardingContainer.prototype.renderDetails = function () {
        return (React.createElement("div", {className: 'content-wrapper'}, React.createElement(AwardingComponentsPanel, {id: 'AwardingCollapsiblePanelID', key: 'AwardingCollapsiblePanel-Key'}), React.createElement(Awarding, {id: 'AwardingID', key: 'Awarding-Key', selectedLanguage: this.props.selectedLanguage, toggleLeftPanel: this.onLeftPanelCollapseOrExpand})));
    };
    /**
     * Reset content refresh statuses
     */
    AwardingContainer.prototype.resetContentRefreshStatuses = function () {
        this.isContentRefreshStarted = false;
    };
    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    AwardingContainer.prototype.resetLogoutConfirmationSatus = function () {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    };
    Object.defineProperty(AwardingContainer.prototype, "isAwardingLeftPanelCollapsed", {
        /**
         * Gets the awarding left panel toggle state based on the useroption
         */
        get: function () {
            var isAwardingLeftPanelCollapsed = false;
            if (userOptionsStore.instance.isLoaded) {
                isAwardingLeftPanelCollapsed = userOptionsHelper.getUserOptionByName(useroptionKeys.AWARDING_LEFT_PANEL_COLLAPSED) === 'true';
            }
            return isAwardingLeftPanelCollapsed;
        },
        enumerable: true,
        configurable: true
    });
    return AwardingContainer;
}(pureRenderComponent));
module.exports = AwardingContainer;
//# sourceMappingURL=awardingcontainer.js.map