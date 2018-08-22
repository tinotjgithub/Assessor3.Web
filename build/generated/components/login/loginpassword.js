"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
// non-typescript require
var classNames = require('classnames');
var localeStore = require('../../stores/locale/localestore');
var htmlUtilities = require('../../utility/generic/htmlutilities');
/**
 * React component class for Login
 */
var LoginPassword = (function (_super) {
    __extends(LoginPassword, _super);
    /**
     * Constructor LoginPassword
     * @param props
     * @param state
     */
    function LoginPassword(props, state) {
        var _this = this;
        _super.call(this, props, state);
        //This variable is using to track the capslock button state on page level
        this._isCapsLockOn = false;
        this._hasFocus = false;
        this._boundHandleKeyDown = null;
        this._boundHandleKeyPress = null;
        // variable to set Password textbox to readonly - prevent setting if IE
        this._readOnly = false;
        /**
         * Set readonly true only for Chrome browser.
         */
        this.setReadOnlyForBrowser = function () {
            if (htmlUtilities.getUserDevice().browser === 'Chrome') {
                _this._readOnly = true;
            }
            else {
                _this._readOnly = false;
            }
        };
        this.state = {
            currentValue: this.props.value,
            hasCapsLockWarning: false,
            hasError: this.props.error
        };
        this.handleChange = this.handleChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this._boundHandleKeyDown = this.handleKeyDown.bind(this);
        this._boundHandleKeyPress = this.checkCapsLock.bind(this);
        this.setReadOnlyForBrowser();
    }
    /**
     * Render component
     * @returns
     */
    LoginPassword.prototype.render = function () {
        /* Onchange event is not working in IE11 while copying and pasting the credentials due to a defect in React, so that we've chage
        that event to OnInput - Defect fix: #37753 */
        var input = htmlUtilities.isIE11 ?
            React.createElement("input", {type: 'password', "aria-describedby": 'password-tip', className: classNames('text-underline', { 'bubble-on': this.state.hasCapsLockWarning, 'error': this.state.hasError }), id: this.props.id, value: this.state.currentValue, onInput: this.handleChange, onFocus: this.onFocus, onBlur: this.onBlur, required: true, readOnly: this._readOnly, autoComplete: 'off'}) :
            React.createElement("input", {type: 'password', "aria-describedby": 'password-tip', className: classNames('text-underline', { 'bubble-on': this.state.hasCapsLockWarning, 'error': this.state.hasError }), id: this.props.id, value: this.state.currentValue, onChange: this.handleChange, onFocus: this.onFocus, onBlur: this.onBlur, required: true, readOnly: this._readOnly, autoComplete: 'off'});
        return (React.createElement("div", {className: 'relative'}, input, React.createElement("label", {htmlFor: 'passwordBox'}, localeStore.instance.TranslateText('login.login-page.password')), React.createElement("span", {className: 'sprite-icon password-icon'}), React.createElement("span", {className: 'bar'}), React.createElement("span", {className: 'bubble callout capslock-on info-alert'}, React.createElement("span", {className: 'bubble-text', id: 'password-tip'}, localeStore.instance.TranslateText('login.login-page.caps-lock-on-warning')))));
    };
    /**
     * Component did mount
     */
    LoginPassword.prototype.componentDidMount = function () {
        window.addEventListener('keydown', this._boundHandleKeyDown);
        // attaching keyup event listner to solve MAC capslock indicator issue.
        // keydown event is not firing in MAC machine while pressing CapsLock button off.
        if (navigator.platform.indexOf('Mac') > -1) {
            window.addEventListener('keyup', this._boundHandleKeyDown);
        }
        window.addEventListener('keypress', this._boundHandleKeyPress);
    };
    /**
     * Component will unmount
     */
    LoginPassword.prototype.componentWillUnmount = function () {
        window.removeEventListener('keydown', this._boundHandleKeyDown);
        // detaching keyup event listner to solve MAC capslock indicator issue.
        // keydown event is not firing in MAC machine while pressing CapsLock button off.
        if (navigator.platform.indexOf('Mac') > -1) {
            window.removeEventListener('keyup', this._boundHandleKeyDown);
        }
        window.removeEventListener('keypress', this._boundHandleKeyPress);
    };
    /**
     * This will set state hasError based on props value
     * @param nxtProps
     */
    LoginPassword.prototype.componentWillReceiveProps = function (nxtProps) {
        this.setState({ hasError: nxtProps.error });
    };
    /**
     * This method will set the current value.
     * Also this will set password for login form.
     * @param e
     */
    LoginPassword.prototype.handleChange = function (e) {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value, enums.LoginForm.password);
    };
    /**
     * This method will check whether the CapsLock button is on or not
     * @param e
     */
    LoginPassword.prototype.checkCapsLock = function (e) {
        var s = String.fromCharCode(e.which);
        if ((s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) ||
            (s.toUpperCase() !== s && s.toLowerCase() === s && e.shiftKey)) {
            this._isCapsLockOn = true;
            if (this._hasFocus) {
                this.setCapsLockIndicator(true);
            }
        }
        else if ((s.toLowerCase() === s && s.toUpperCase() !== s && !e.shiftKey) ||
            (s.toLowerCase() !== s && s.toUpperCase() === s && e.shiftKey)) {
            this._isCapsLockOn = false;
            if (this._hasFocus) {
                this.setCapsLockIndicator(false);
            }
        }
    };
    /**
     * This method will display the CapsLock indicator if CapsLock button pressed and
     *  Password box has focus.
     * @param e
     */
    LoginPassword.prototype.handleKeyDown = function (e) {
        // CapsLock keycode - 20
        if (e.keyCode === 20) {
            this._isCapsLockOn = !this._isCapsLockOn;
            if (this._hasFocus) {
                this.setCapsLockIndicator(this._isCapsLockOn);
            }
        }
    };
    /**
     * This method will call on focus
     * @param e
     */
    LoginPassword.prototype.onFocus = function (e) {
        //to remove IE's default capslock on warning
        document.msCapsLockWarningOff = true;
        e.target.removeAttribute('readOnly');
        this._hasFocus = true;
        if (this.state.hasError) {
            this.setState({ hasError: false });
        }
        if (!this.state.hasCapsLockWarning) {
            this.setCapsLockIndicator(this._isCapsLockOn);
        }
    };
    /**
     * This method will hide the CapsLock indicator on focus out
     * @param e
     */
    LoginPassword.prototype.onBlur = function (e) {
        this._hasFocus = false;
        if (this.state.hasCapsLockWarning) {
            this.setCapsLockIndicator(false);
        }
    };
    /**
     * This method will set the CapsLock indicator status
     * @param show
     */
    LoginPassword.prototype.setCapsLockIndicator = function (show) {
        this.setState({ hasCapsLockWarning: show });
    };
    return LoginPassword;
}(pureRenderComponent));
module.exports = LoginPassword;
//# sourceMappingURL=loginpassword.js.map