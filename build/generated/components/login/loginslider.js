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
var localeStore = require('../../stores/locale/localestore');
var stringHelper = require('../../utility/generic/stringhelper');
var constants = require('../utility/constants');
/* tslint:enable:no-empty-interfaces */
/**
 * React component class for Login
 */
var LoginSlider = (function (_super) {
    __extends(LoginSlider, _super);
    /**
     * Constructor LoginSlider
     * @param props
     */
    function LoginSlider(props) {
        _super.call(this, props, null);
        this.state = {};
    }
    /**
     * Render method
     */
    LoginSlider.prototype.render = function () {
        var sliderTextHeader = stringHelper.format(localeStore.instance.TranslateText('login.login-page.welcome-message'), [String(String.fromCharCode(179))]);
        return (React.createElement("div", {className: 'col-1-of-2'}, React.createElement("div", {className: 'slider-holder'}, React.createElement("div", {className: 'horizontal-carousel-container'}, React.createElement("div", {className: 'horizontal-carousel-inner'}, React.createElement("div", {className: 'horizontal-carousel-mask'}, React.createElement("div", {className: 'horizontal-carousel-wrap'}, React.createElement("div", {className: 'horizontal-slide active text-centre', id: 'slide0'}, React.createElement("h3", null, sliderTextHeader), React.createElement("p", null, this.getResourceText('login.login-page.welcome-detail'))), React.createElement("div", {className: 'horizontal-slide hide text-centre', id: 'slide1'}, React.createElement("h3", null, sliderTextHeader), React.createElement("p", null, this.getResourceText('login.login-page.welcome-detail'))), React.createElement("div", {className: 'horizontal-slide hide text-centre', id: 'slide2'}, React.createElement("h3", null, sliderTextHeader), React.createElement("p", null, this.getResourceText('login.login-page.welcome-detail'))))))))));
    };
    /**
     * gets text from resource file
     * @param resourceKey
     */
    LoginSlider.prototype.getResourceText = function (resourceKey) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey), [constants.NONBREAKING_HYPHEN_UNICODE]);
    };
    return LoginSlider;
}(pureRenderComponent));
module.exports = LoginSlider;
//# sourceMappingURL=loginslider.js.map