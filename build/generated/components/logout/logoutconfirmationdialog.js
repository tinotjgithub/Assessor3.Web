"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for ask for logout button in user options
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var useroptionStore = require('../../stores/useroption/useroptionstore');
var ToggleButton = require('../utility/togglebutton');
var userInfoStore = require('../../stores/userinfo/userinfostore');
/**
 * React component class for Ask on Logout confirmation
 */
var LogoutConfirmationDialog = (function (_super) {
    __extends(LogoutConfirmationDialog, _super);
    /**
     * Constructor LogoutConfirmationDialog
     * @param props
     * @param state
     */
    function LogoutConfirmationDialog(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._emailAddress = '';
        /**
         * Refresh state
         */
        this.refreshState = function () {
            /** resetting the locally stored user option collection */
            // userOptionsHelper.resetChangedUserOptions();
            _this.setState({ isAskOnLogout: !_this.state.isAskOnLogout });
            _this.setState({ isAutoAdvanceOn: !_this.state.isAutoAdvanceOn });
        };
        /**
         * Get the user information from userinfo store
         */
        this.getUserInformation = function () {
            _this._emailAddress = userInfoStore.instance.EmailAddress;
            _this._isScriptAvailabilityEmailAlert = userInfoStore.instance.IsScriptAvailabilityEmailAlert;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Get the email address from userinfo store after save the email address.
         */
        this.userInfoSaved = function () {
            _this._emailAddress = userInfoStore.instance.EmailAddress;
            _this.setState({ renderedOn: Date.now() });
        };
        this.state = {
            isAskOnLogout: userOptionsHelper.getUserOptionByName(userOptionKeys.ASK_ON_LOG_OUT) === 'true' ? true : false,
            isAutoAdvanceOn: userOptionsHelper.getUserOptionByName(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER) === 'true' ?
                true : false,
            isPauseMediaonOffpageCommentAdd: userOptionsHelper.getUserOptionByName(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED) === 'true' ?
                true : false,
            isEmailmeToggleOn: userOptionsHelper.getUserOptionByName(userOptionKeys.EMAIL_ME_WHEN_SCRIPTS_ARE_AVAILABLE_FOR_STANDARDISATION)
                === 'true' ? true : false,
            isOnScreenHintsOn: userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true' ? true : false,
            renderedOn: 0
        };
        this._isAskOnLogout = true;
        this._isAutoAdvanceOn = true;
        this._isOffpageCommentOn = true;
        this._isEmailmeToggleOn = true;
        this._isOnScreenHintsOn = true;
        this.handleChange = this.handleChange.bind(this);
        this.onToggleChange = this.onToggleChange.bind(this);
        this.onOffPageCommentToggleChange = this.onOffPageCommentToggleChange.bind(this);
        this.onEmailmeToggleChange = this.onEmailmeToggleChange.bind(this);
        this.onOnScreenHintsToggleChange = this.onOnScreenHintsToggleChange.bind(this);
    }
    /**
     * Render component
     */
    LogoutConfirmationDialog.prototype.render = function () {
        /**
         * the value of the ask on logout option should take from local json if it is changed else take it from the store
         */
        this._isAskOnLogout = userOptionsHelper.getUserOptionByName(userOptionKeys.ASK_ON_LOG_OUT) === 'true' ? true : false;
        this._isAutoAdvanceOn = userOptionsHelper.getUserOptionByName(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER)
            === 'true' ? true : false;
        this._isOffpageCommentOn = userOptionsHelper.getUserOptionByName(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED)
            === 'true' ? true : false;
        this._isEmailmeToggleOn = userOptionsHelper.getUserOptionByName(userOptionKeys.EMAIL_ME_WHEN_SCRIPTS_ARE_AVAILABLE_FOR_STANDARDISATION)
            === 'true' ? true : false;
        this._isOnScreenHintsOn = userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true' ? true : false;
        var emailMeToggleOption;
        var enterEmailAddressAbove;
        if (this._emailAddress === null || this._emailAddress === '') {
            enterEmailAddressAbove = (React.createElement("label", {className: 'error-alert simple-alert'}, localeStore.instance.TranslateText('generic.user-menu.user-options.enter-email-address-above')));
        }
        else {
            enterEmailAddressAbove = null;
        }
        if (this._isScriptAvailabilityEmailAlert) {
            emailMeToggleOption = (React.createElement("div", {className: 'form-field inline script-available-settings'}, React.createElement("label", {id: 'scriptAvailability', className: 'label'}, localeStore.instance.TranslateText('generic.user-menu.user-options.email-me-when-scripts-are-available-for-standardisation'), React.createElement("br", null), enterEmailAddressAbove), React.createElement(ToggleButton, {id: 'scriptavailability_id', key: 'scriptavailability_key', isChecked: this._isEmailmeToggleOn, selectedLanguage: this.props.selectedLanguage, index: 0, onChange: this.onEmailmeToggleChange, style: this.props.style, className: 'form-component', title: localeStore.instance.TranslateText('generic.user-menu.user-options.email-me-when-scripts-are-available-for-standardisation'), isDisabled: this._emailAddress === null || this._emailAddress === '' ? true : false, onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')})));
        }
        else {
            emailMeToggleOption = null;
        }
        return (React.createElement("div", null, React.createElement("div", {className: 'logout-settings form-field inline'}, React.createElement("label", {className: 'label'}, localeStore.instance.TranslateText('generic.user-menu.user-options.logout-confirmation')), React.createElement("div", {className: 'form-component toggle-button', "aria-pressed": 'true'}, React.createElement("input", {type: 'checkbox', id: 'logoutConfirm', checked: this._isAskOnLogout, "data-value": this._isAskOnLogout, onChange: this.handleChange}), React.createElement("label", {title: localeStore.instance.TranslateText('generic.user-menu.user-options.logout-confirmation-tooltip'), className: 'toggle-label', htmlFor: 'logoutConfirm'}, React.createElement("div", {className: 'toggle-content'}, React.createElement("div", {className: 'on-text'}, localeStore.instance.TranslateText('generic.toggle-button-states.on')), React.createElement("div", {className: 'off-text'}, localeStore.instance.TranslateText('generic.toggle-button-states.off'))), React.createElement("div", {className: 'toggle-switch'})))), React.createElement("div", {className: 'form-field inline single-digit-mark-settings'}, React.createElement("label", {id: 'singleDigit', className: 'label'}, localeStore.instance.TranslateText('generic.user-menu.user-options.assign-single-digit-marks-without-pressing-enter')), React.createElement(ToggleButton, {id: 'assignSingleDigit_id', key: 'assignSingleDigit_key', isChecked: this._isAutoAdvanceOn, selectedLanguage: this.props.selectedLanguage, index: 0, onChange: this.onToggleChange, style: this.props.style, className: 'form-component', title: localeStore.instance.TranslateText('generic.user-menu.user-options.assign-single-digit-marks-without-pressing-enter'), onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')})), React.createElement("div", {className: 'form-field inline pause-media-offpagecomment'}, React.createElement("label", {id: 'enhanced', className: 'label'}, localeStore.instance.TranslateText('generic.user-menu.user-options.pause-media-when-offpage-comments-are-added')), React.createElement(ToggleButton, {id: 'enhancedoffpage_id', key: 'enhancedoffpage_key', isChecked: this._isOffpageCommentOn, selectedLanguage: this.props.selectedLanguage, index: 0, onChange: this.onOffPageCommentToggleChange, style: this.props.style, className: 'form-component', title: localeStore.instance.TranslateText('generic.user-menu.user-options.pause-media-when-offpage-comments-are-added'), onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')})), emailMeToggleOption, React.createElement("div", {className: 'on-screen-hint-settings form-field inline'}, React.createElement("label", {id: 'onScreenHint', className: 'label'}, localeStore.instance.TranslateText('generic.user-menu.user-options.on-screen-hints')), React.createElement(ToggleButton, {id: 'onScreenHint_id', key: 'onScreenHint_key', isChecked: this._isOnScreenHintsOn, selectedLanguage: this.props.selectedLanguage, index: 0, onChange: this.onOnScreenHintsToggleChange, style: this.props.style, className: 'form-component', title: localeStore.instance.TranslateText('generic.user-menu.user-options.on-screen-hints'), onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')}))));
    };
    /**
     * for handling the ask on logout option change event.
     */
    LogoutConfirmationDialog.prototype.handleChange = function (evt) {
        this._isAskOnLogout = !this._isAskOnLogout;
        /** Adding/Updating the changed value to the local json variable changed user options */
        userOptionsHelper.save(userOptionKeys.ASK_ON_LOG_OUT, String(this._isAskOnLogout));
        this.setState({ isAskOnLogout: !this.state.isAskOnLogout });
    };
    /**
     * for handling the ask on Single Digit Mark Setting option change event.
     */
    LogoutConfirmationDialog.prototype.onToggleChange = function (evt) {
        this._isAutoAdvanceOn = !this._isAutoAdvanceOn;
        /** Adding/Updating the changed value to the local json variable changed user options */
        userOptionsHelper.save(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER, String(this._isAutoAdvanceOn));
        this.setState({ isAutoAdvanceOn: !this.state.isAutoAdvanceOn });
    };
    /**
     * for handling the ask on Single Digit Mark Setting option change event.
     */
    LogoutConfirmationDialog.prototype.onOffPageCommentToggleChange = function (evt) {
        this._isOffpageCommentOn = !this._isOffpageCommentOn;
        /** Adding/Updating the changed value to the local json variable changed user options */
        userOptionsHelper.save(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED, String(this._isOffpageCommentOn));
        this.setState({ isPauseMediaonOffpageCommentAdd: !this.state.isPauseMediaonOffpageCommentAdd });
    };
    /**
     * for handling the ask on Script Availability Email Alert change event.
     */
    LogoutConfirmationDialog.prototype.onEmailmeToggleChange = function (evt) {
        this._isEmailmeToggleOn = !this._isEmailmeToggleOn;
        userOptionsHelper.save(userOptionKeys.EMAIL_ME_WHEN_SCRIPTS_ARE_AVAILABLE_FOR_STANDARDISATION, String(this._isEmailmeToggleOn));
        this.setState({ isEmailmeToggleOn: !this.state.isEmailmeToggleOn });
    };
    /**
     *
     * Handling the on screen hint toggle change event
     */
    LogoutConfirmationDialog.prototype.onOnScreenHintsToggleChange = function (evt) {
        this._isOnScreenHintsOn = !this._isOnScreenHintsOn;
        userOptionsHelper.save(userOptionKeys.ON_SCREEN_HINTS, String(this._isOnScreenHintsOn));
        this.setState({ isOnScreenHintsOn: !this.state.isOnScreenHintsOn });
    };
    /**
     * Subscribe the user option save event to re-render the component on change of ask on logout value.
     */
    LogoutConfirmationDialog.prototype.componentWillMount = function () {
        useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT, this.refreshState);
    };
    /**
     * Unsubscribe events
     */
    LogoutConfirmationDialog.prototype.componentWillUnmount = function () {
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT, this.refreshState);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.getUserInformation);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    };
    /**
     * Component did mount
     */
    LogoutConfirmationDialog.prototype.componentDidMount = function () {
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.getUserInformation);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    };
    return LogoutConfirmationDialog;
}(pureRenderComponent));
module.exports = LogoutConfirmationDialog;
//# sourceMappingURL=logoutconfirmationdialog.js.map