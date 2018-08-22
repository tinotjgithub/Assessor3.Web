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
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var LanguageSelector = require('../utility/locale/languageselector');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var Logo = require('../utility/logo/logo');
/* tslint:enable:no-empty-interfaces */
/**
 * React component class for Login
 */
var LoginHeader = (function (_super) {
    __extends(LoginHeader, _super);
    /**
     * Constructor LoginHeader
     * @param props
     * @param state
     */
    function LoginHeader(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.lastTap = 0;
        /**
         * This will block the double-tap zoom in ipad
         */
        this.blockDoubleTapZoom = function (e) {
            var currentTime = new Date().getTime();
            var tapLength = currentTime - _this.lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            _this.lastTap = currentTime;
        };
        /**
         * This will block the pinch-to-zoom in ipad
         */
        this.blockPinchToZoom = function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };
    }
    /**
     * Render component
     */
    LoginHeader.prototype.render = function () {
        return (React.createElement("header", {className: 'fixed'}, React.createElement("div", {className: 'wrapper clearfix'}, React.createElement("div", {className: 'breadcrumb-holder'}, React.createElement("ul", {className: 'breadcrumb'}, React.createElement("li", {className: 'breadcrumb-item dropdown-wrap header-dropdown'}, React.createElement(Logo, {id: 'a3Logo_loginPage', key: 'key_a3Logo_loginPage', selectedLanguage: this.props.selectedLanguage})))), React.createElement("ul", {className: 'nav shift-right', role: 'menubar'}, React.createElement(LanguageSelector, {availableLanguages: languageList, selectedLanguage: this.props.selectedLanguage, isBeforeLogin: true}))), React.createElement("div", {className: 'blue-strip'})));
    };
    /**
     * Component did  mount
     */
    LoginHeader.prototype.componentDidMount = function () {
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            document.documentElement.addEventListener('touchstart', this.blockPinchToZoom, false);
            document.documentElement.addEventListener('touchend', this.blockDoubleTapZoom, false);
        }
    };
    /**
     * Component will unmount
     */
    LoginHeader.prototype.componentWillUnmount = function () {
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            document.documentElement.removeEventListener('touchstart', this.blockPinchToZoom, false);
            document.documentElement.removeEventListener('touchend', this.blockDoubleTapZoom, false);
        }
    };
    return LoginHeader;
}(pureRenderComponent));
module.exports = LoginHeader;
//# sourceMappingURL=loginheader.js.map