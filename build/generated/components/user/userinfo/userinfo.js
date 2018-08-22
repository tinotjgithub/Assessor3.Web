"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var userInfoActionCreator = require('../../../actions/userinfo/userinfoactioncreator');
var Logout = require('../../logout/logout');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var classNames = require('classnames');
var GenericButton = require('../../utility/genericbutton');
var GenericTextBox = require('../../utility/generictextbox');
var busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
var emailValidator = require('../../../utility/genericvalidators/emailvalidator');
var keyDownHelper = require('../../../utility/generic/keydownhelper');
var messageStore = require('../../../stores/message/messagestore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
var loginSession = require('../../../app/loginsession');
/**
 * Class for displaying user information
 * @returns
 */
var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    /**
     * Initializing a new instance of UserInfo
     */
    function UserInfo(props) {
        var _this = this;
        _super.call(this, props, null);
        this.userName = '';
        this.emailAddress = '';
        this.examinerName = '';
        /**
         * Update the user information.
         */
        this.updateUserInformation = function () {
            _this.userName = userInfoStore.instance.UserName;
            _this.examinerName = userInfoStore.instance.ExaminerName;
            _this.emailAddress = userInfoStore.instance.EmailAddress;
        };
        /**
         * Fires after email save
         */
        this.userInfoSaved = function () {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
            _this.setNormalMode();
        };
        this.state = {
            operationMode: enums.OperationMode.normal,
            isValidEmail: true
        };
        this.onEditEmailClick = this.onEditEmailClick.bind(this);
        this.setValues = this.setValues.bind(this);
        this.OnSaveClick = this.OnSaveClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.switchUserButtonClick = this.switchUserButtonClick.bind(this);
    }
    /**
     * Render component
     */
    UserInfo.prototype.render = function () {
        var outPut = undefined;
        if (this.userName === '') {
            outPut =
                (React.createElement(LoadingIndicator, {id: 'loading', key: 'loading', cssClass: 'section-loader loading'}));
        }
        else {
            outPut = (React.createElement("div", null, React.createElement("div", {className: 'user-photo-holder user-big-icon sprite-icon'}), React.createElement("div", {className: 'user-details'}, React.createElement("h4", {className: 'full-name'}, " ", this.examinerName), React.createElement("h5", {className: 'bolder user-name'}, localeStore.instance.TranslateText('generic.user-menu.profile-section.user-name'), ": ", this.userName)), this.getEmailHolder(), React.createElement("div", null, this.getSwitchUserButton(), React.createElement(Logout, {selectedLanguage: this.props.selectedLanguage}))));
        }
        return (React.createElement("div", {className: 'user-info-wrapper'}, outPut));
    };
    /**
     * Component did mount
     */
    UserInfo.prototype.componentDidMount = function () {
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    };
    /**
     * Component will unmount
     */
    UserInfo.prototype.componentWillUnmount = function () {
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    };
    /**
     * Comparing the props to check the rerender
     * @param {Props} nextProps
     */
    UserInfo.prototype.componentWillReceiveProps = function (nextProps) {
        // If the use info panel has been opened deactivating to set the free flow
        // of the email edit and submit.
        if ((this.props.isUserInfoOpen === false || this.props.isUserInfoOpen === undefined) && nextProps.isUserInfoOpen === true) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EmailAddress);
        }
        else if (this.props.isUserInfoOpen === true && nextProps.isUserInfoOpen === false
            && (!messageStore.instance.isMessagePanelVisible && !exceptionStore.instance.isExceptionPanelVisible)) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.EmailAddress);
            this.setState({
                operationMode: enums.OperationMode.normal
            });
        }
    };
    /**
     * Returns the email edit div
     * @returns
     */
    UserInfo.prototype.getEmailHolder = function () {
        if (!this.props.isUserInfoOpen) {
            /** if user clicks outside the user profile, email will be restored from store and
             *  setting the email text box into normal mode
             */
            this.emailAddress = userInfoStore.instance.EmailAddress;
            this.setValues(this.emailAddress);
        }
        return (React.createElement("div", {className: classNames('user-email-holder', {
            ' edit': (this.state.operationMode === enums.OperationMode.edit)
        })}, React.createElement("a", {href: 'javascript:void(0)', className: 'email-link-holder', onClick: this.onEditEmailClick}, React.createElement("span", {className: 'email-address'}, this.emailAddress), React.createElement("span", {className: 'add-email-text'}, localeStore.instance.TranslateText('generic.user-menu.profile-section.email-address-placeholder')), React.createElement("span", {className: 'edit-small-icon sprite-icon'}), React.createElement("span", {className: 'add-small-icon sprite-icon'})), React.createElement(GenericTextBox, {id: 'emailId', key: 'emailId', setValue: this.setValues, onEnterKeyDown: this.OnSaveClick, value: this.emailAddress, tabindex: 1}), React.createElement("span", {className: 'bar'}), React.createElement("div", {className: 'email-edit-footer', "aria-hidden": 'true'}, this.getEmaiValidationMessage(), React.createElement("div", {className: 'save-button-wrapper'}, React.createElement("button", {className: 'rounded', id: 'cancelEditEmail', onClick: this.onCancelClick}, localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button')), React.createElement("button", {className: 'rounded primary', id: 'saveEmail', onClick: this.OnSaveClick}, localeStore.instance.TranslateText('generic.user-menu.profile-section.save-email-button'))))));
    };
    /**
     * Handles the edit click.
     * @param {any} evnt
     */
    UserInfo.prototype.onEditEmailClick = function (evnt) {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EmailAddress);
        this.emailAddress = userInfoStore.instance.EmailAddress;
        this.setState({
            operationMode: enums.OperationMode.edit,
            isValidEmail: true
        });
    };
    /**
     * Handles the cancel click.
     * @param {any} evnt
     */
    UserInfo.prototype.onCancelClick = function (evnt) {
        this.setNormalMode();
    };
    /**
     * Handles the save click
     * @param {any} evnt
     */
    UserInfo.prototype.OnSaveClick = function (evnt) {
        var emailValidatorInstance = new emailValidator();
        var examinerEmailArgument;
        /* If email id is invalid setting the state for re-render */
        if (!emailValidatorInstance.ValidateEmail(this.emailAddress)) {
            this.setState({
                isValidEmail: false
            });
            return;
        }
        /* Setting the examinerEmailArgument */
        examinerEmailArgument = { emailAddress: this.emailAddress };
        var busyIndicatorInvoker;
        busyIndicatorInvoker = enums.BusyIndicatorInvoker.saveEmail;
        /*Show busy indicator on submitting response */
        busyIndicatorActionCreator.setBusyIndicatorInvoker(busyIndicatorInvoker);
        this.setState({
            isValidEmail: true
        });
        userInfoActionCreator.SaveEmailAddress(examinerEmailArgument);
    };
    /**
     * Set value from the Generic textbox component
     * @param {string} value
     */
    UserInfo.prototype.setValues = function (value) {
        this.emailAddress = value;
        // Deactivate MarkEntry only if UserInfo is open
        if (this.props.isUserInfoOpen) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EmailAddress);
        }
    };
    /**
     * Returns the email validation div
     * @returns
     */
    UserInfo.prototype.getEmaiValidationMessage = function () {
        if (!this.state.isValidEmail) {
            return (React.createElement("div", {className: 'error-holder'}, React.createElement("span", {className: 'error-alert bubble simple-alert show text-centre'}, localeStore.instance.TranslateText('generic.user-menu.profile-section.email-validation-message'))));
        }
        else {
            return (React.createElement("div", null));
        }
    };
    /**
     * Disabling edit
     */
    UserInfo.prototype.setNormalMode = function () {
        this.emailAddress = userInfoStore.instance.EmailAddress;
        this.setValues(this.emailAddress);
        this.setState({
            operationMode: enums.OperationMode.normal
        });
    };
    /**
     * save email on keypress
     * @param event
     */
    UserInfo.prototype.handleKeyDown = function (event) {
        // enter key keycode
        if ((event.keyCode === 13) && (this.state.operationMode === enums.OperationMode.edit)) {
            this.OnSaveClick(event);
        }
    };
    /**
     * Returns switch user div
     * @returns
     */
    UserInfo.prototype.getSwitchUserButton = function () {
        if (loginSession.IS_SUPPORT_ADMIN_LOGIN) {
            return (React.createElement(GenericButton, {id: 'button-primary-rounded-switch-user-button', key: 'key-button-primary-rounded-switch-user-button', className: 'button primary rounded', title: localeStore.instance.TranslateText('generic.user-menu.profile-section.switch-user-button'), content: localeStore.instance.TranslateText('generic.user-menu.profile-section.switch-user-button'), disabled: false, onClick: this.switchUserButtonClick}));
        }
    };
    /**
     * Switch user button click event.
     */
    UserInfo.prototype.switchUserButtonClick = function () {
        userInfoActionCreator.onSwitchUserButtonClick();
    };
    return UserInfo;
}(pureRenderComponent));
module.exports = UserInfo;
//# sourceMappingURL=userinfo.js.map