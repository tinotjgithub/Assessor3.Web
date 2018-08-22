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
// non-typescript require
var classNames = require('classnames');
var localeStore = require('../../stores/locale/localestore');
var enums = require('../utility/enums');
var htmlUtilities = require('../../utility/generic/htmlutilities');
/**
 * React component class for Login
 */
var LoginUserName = (function (_super) {
    __extends(LoginUserName, _super);
    /**
     * Constructor LoginUserName
     * @param props
     * @param state
     */
    function LoginUserName(props, state) {
        _super.call(this, props, state);
        this.state = {
            currentValue: this.props.value,
            hasError: this.props.error
        };
        this.handleChange = this.handleChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }
    /**
     * Render method
     * @returns
     */
    LoginUserName.prototype.render = function () {
        /* Onchange event is not working in IE11 while copying and pasting the credentials due to a defect in React, so that we've chage
        that event to OnInput - Defect fix: #37753 */
        var input = htmlUtilities.isIE11 ?
            React.createElement("input", {type: 'text', required: true, className: classNames('text-underline', { 'error': this.state.hasError }), id: this.props.id, defaultValue: this.state.currentValue, onInput: this.handleChange, onFocus: this.onFocus, spellCheck: false, autoFocus: true, autoComplete: 'off'}) :
            React.createElement("input", {type: 'text', required: true, className: classNames('text-underline', { 'error': this.state.hasError }), id: this.props.id, defaultValue: this.state.currentValue, onChange: this.handleChange, onFocus: this.onFocus, spellCheck: false, autoFocus: true, autoComplete: 'off'});
        return (React.createElement("div", {className: 'relative'}, input, React.createElement("label", {htmlFor: 'usernameBox'}, localeStore.instance.TranslateText('login.login-page.username')), React.createElement("span", {className: 'sprite-icon username-icon'}), React.createElement("span", {className: 'bar'})));
    };
    /**
     * This method will set the error state.
     * @param nxtProps
     */
    LoginUserName.prototype.componentWillReceiveProps = function (nxtProps) {
        this.setState({ hasError: nxtProps.error });
    };
    /**
     * This method will set value for login form
     * @param e
     */
    LoginUserName.prototype.handleChange = function (e) {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value, enums.LoginForm.username);
    };
    /**
     * This method will reset error style on focus
     * @param e
     */
    LoginUserName.prototype.onFocus = function (e) {
        if (this.state.hasError) {
            this.setState({ hasError: false });
        }
    };
    return LoginUserName;
}(pureRenderComponent));
module.exports = LoginUserName;
//# sourceMappingURL=loginusername.js.map