"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var UserOptionSettings = require('../useroptions/useroptions');
var localeStore = require('../../../stores/locale/localestore');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var UserInfo = require('../userinfo/userinfo');
var userInfoActionCreator = require('../../../actions/userinfo/userinfoactioncreator');
var domManager = require('../../../utility/generic/domhelper');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var classNames = require('classnames');
/**
 * Represents the User details
 */
var UserDetails = (function (_super) {
    __extends(UserDetails, _super);
    /**
     * Constructor UserDetails
     * @param props
     * @param state
     */
    function UserDetails(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._boundHandleOnClick = null;
        /**
         * Handle click events on the window and collapse the user details
         * @param {any} source - The source element
         */
        this.handleOnClick = function (e) {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'userMenuItem'; }) == null) {
                if (_this.state.isUserInfoOpen !== undefined && _this.state.isUserInfoOpen === true) {
                    /** Saving changed user options if any of them changed */
                    _this.saveUserOptions();
                    markingActionCreator.setMarkEntrySelected();
                    _this.setState({ isUserInfoOpen: false, isEditSettingsOpen: false });
                }
            }
            // both touchend and click event is fired one after other, 
            // this avoid resetting store in touchend
            if (_this.state.isUserInfoOpen !== undefined && e.type !== 'touchend') {
                userInfoActionCreator.userInfoClicked(_this.state.isUserInfoOpen);
            }
        };
        /**
         * Update the user information.
         */
        this.updateUserInformation = function () {
            /** setting the state when user info id loaded to initiate rendering of user info component */
            _this.setState({ isUserInfoLoaded: true });
        };
        /**
         * close user info on offline mode
         */
        this.onOnlineStatusChanged = function () {
            // in offline mode if the user info panel is open and user details are not loaded yet, then close the panel
            if (_this.state.isUserInfoOpen &&
                !userInfoStore.instance.UserName &&
                !applicationStore.instance.isOnline) {
                _this.openCloseUserDetails(false);
            }
        };
        this.state = {
            isUserInfoOpen: undefined,
            isEditSettingsOpen: undefined,
            isUserInfoLoaded: false
        };
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.openCloseUserDetails = this.openCloseUserDetails.bind(this);
        this.onEditSettingsClick = this.onEditSettingsClick.bind(this);
    }
    /**
     * Open/Close the User details
     * @param {any} source - The source element
     */
    UserDetails.prototype.openCloseUserDetails = function (saveUserOptions) {
        if (saveUserOptions === void 0) { saveUserOptions = true; }
        if (this.state.isUserInfoOpen === undefined || this.state.isUserInfoOpen === false) {
            /** if user details window is open, get the user info details to fill */
            userInfoActionCreator.GetLoggedUserInfo();
            this.setState({ isUserInfoOpen: true });
        }
        else {
            if (saveUserOptions) {
                /** Saving changed user options if any of them changed */
                this.saveUserOptions();
            }
            markingActionCreator.setMarkEntrySelected();
            this.setState({ isUserInfoOpen: false, isEditSettingsOpen: false });
        }
    };
    /**
     *  Open/Close edit user option window
     * @param source - The source element
     */
    UserDetails.prototype.onEditSettingsClick = function (source) {
        if (this.state.isEditSettingsOpen === undefined || this.state.isEditSettingsOpen === false) {
            this.setState({ isEditSettingsOpen: true });
        }
        else {
            this.setState({ isEditSettingsOpen: false });
        }
    };
    /**
     * User options save
     */
    UserDetails.prototype.saveUserOptions = function () {
        /** Saving changed user options if any of them changed */
        userOptionsHelper.InitiateSaveUserOption(false);
    };
    /**
     * Subscribe window click event
     */
    UserDetails.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        /** subscribe to user info event */
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.TOGGLE_USER_INFO_PANEL, this.openCloseUserDetails);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    };
    /**
     * Unsubscribe window click event
     */
    UserDetails.prototype.componentWillUnmount = function () {
        // Resetting the useroption status to closed once component is being removed from view.
        userInfoActionCreator.userInfoClicked(false);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.TOGGLE_USER_INFO_PANEL, this.openCloseUserDetails);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    };
    /**
     * Render component
     * @returns
     */
    UserDetails.prototype.render = function () {
        var _this = this;
        return (React.createElement("li", {id: 'userMenuItem', role: 'menuitem', "aria-haspopup": 'true', className: classNames('dropdown-wrap user-menu', {
            'open': this.isOpenUserInfo,
            'close': this.state.isUserInfoOpen === undefined ? this.state.isUserInfoOpen : !this.isOpenUserInfo
        }), title: ''}, React.createElement("a", {href: 'javascript:void(0)', title: localeStore.instance.TranslateText('generic.navigation-bar.user-menu-tooltip'), className: 'menu-button allow-edge-tap', onClick: function () { return _this.openCloseUserDetails(); }}, React.createElement("span", {className: 'sprite-icon user-icon allow-edge-tap'}, "User Profile"), React.createElement("span", null), React.createElement("span", {className: 'sprite-icon menu-arrow-icon lite allow-edge-tap'})), React.createElement("div", {className: 'menu-callout'}), React.createElement("div", {role: 'menu', "aria-hidden": 'true', className: classNames('menu', { 'expanded': this.state.isEditSettingsOpen })}, React.createElement("div", {className: 'user-info-holder'}, React.createElement(UserInfo, {isUserInfoLoaded: this.state.isUserInfoLoaded, selectedLanguage: this.props.selectedLanguage, isUserInfoOpen: this.isOpenUserInfo}), React.createElement("div", {className: 'edit-settings-nav-holder'}, React.createElement("a", {href: 'javascript:void(0)', onClick: this.onEditSettingsClick, className: 'edit-settings-nav'}, localeStore.instance.TranslateText('generic.user-menu.profile-section.edit-settings'), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})))), React.createElement(UserOptionSettings, {selectedLanguage: this.props.selectedLanguage, isUserOptionLoaded: this.props.isUserOptionLoaded}))));
    };
    Object.defineProperty(UserDetails.prototype, "isOpenUserInfo", {
        /**
         * gets whether open the user info or not
         */
        get: function () {
            // in offline mode if the user info panel is open and user details are not loaded yet, then close the panel
            // if the user details are loaded, then do not close the panel even if system in offline mode
            return this.state.isUserInfoOpen &&
                ((!userInfoStore.instance.UserName && applicationStore.instance.isOnline) ||
                    (userInfoStore.instance.UserName && userInfoStore.instance.UserName !== ''));
        },
        enumerable: true,
        configurable: true
    });
    return UserDetails;
}(pureRenderComponent));
module.exports = UserDetails;
//# sourceMappingURL=userdetails.js.map