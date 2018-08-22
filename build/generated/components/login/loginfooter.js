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
var PureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
/* tslint:enable:no-empty-interfaces */
/**
 * React component class for Login
 */
var LoginFooter = (function (_super) {
    __extends(LoginFooter, _super);
    /**
     * Constructor Login Footer
     * @param props
     */
    function LoginFooter(props) {
        _super.call(this, props, null);
    }
    /**
     * Renders component
     * @returns
     */
    LoginFooter.prototype.render = function () {
        return (React.createElement("footer", {className: 'footer'}, React.createElement("div", {className: 'wrapper clearfix'}, React.createElement("div", {className: 'col-wrap responsive-medium'}, React.createElement("div", {className: 'col-1-of-2'}, React.createElement("div", {className: 'copyright'}, String.fromCharCode(169) + localeStore.instance.TranslateText('login.login-page.copyright')))))));
    };
    return LoginFooter;
}(PureRenderComponent));
module.exports = LoginFooter;
//# sourceMappingURL=loginfooter.js.map