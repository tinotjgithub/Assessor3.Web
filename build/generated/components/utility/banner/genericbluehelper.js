"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var bannerBase = require('./bannerbase');
var enums = require('../enums');
var classNames = require('classnames');
/**
 * Helper message component for blue banner with close button
 */
var GenericBlueHelper = (function (_super) {
    __extends(GenericBlueHelper, _super);
    function GenericBlueHelper() {
        var _this = this;
        _super.apply(this, arguments);
        /**
         * on click on the close button
         */
        this.onCloseClick = function () {
            if (_this.props.bannerType === enums.BannerType.HelperMessageWithClose) {
                _this.props.onCloseClick();
            }
            _this.setState({
                isVisible: false
            });
        };
    }
    /**
     * Render method
     */
    GenericBlueHelper.prototype.render = function () {
        var toRender = (this.props.message !== null && this.props.message !== '') ?
            React.createElement("div", {className: this.classNameToApply, id: this.props.id, key: this.props.id, role: this.props.role, "aria-hidden": this.props.isAriaHidden}, React.createElement("a", {id: this.props.id + 'Close', key: this.props.id + 'Close', href: 'javascript:void(0)', onClick: this.onCloseClick, className: 'close', title: 'close'}, React.createElement("span", {className: 'close-icon'})), React.createElement("p", {className: 'message-body'}, this.props.message)) : null;
        return toRender;
    };
    Object.defineProperty(GenericBlueHelper.prototype, "classNameToApply", {
        /**
         * Returns the class name to apply for the blue helper.
         */
        get: function () {
            var classNameToApply = '';
            if (this.props.bannerType === enums.BannerType.CompleteStdSetupBanner) {
                classNameToApply = 'message-box dark-msg float-msg left callout left-bottom complete-setup';
            }
            else if (this.props.bannerType === enums.BannerType.HelperMessageWithClose) {
                classNameToApply = 'message-box help-message dark-msg float-msg top right callout ';
            }
            classNameToApply = classNames(classNameToApply, { show: this.state.isVisible }, { hide: !this.state.isVisible });
            return classNameToApply;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component will receive props
     */
    GenericBlueHelper.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.isVisible !== nextProps.isVisible) {
            this.setState({
                isVisible: nextProps.isVisible
            });
        }
    };
    return GenericBlueHelper;
}(bannerBase));
module.exports = GenericBlueHelper;
//# sourceMappingURL=genericbluehelper.js.map