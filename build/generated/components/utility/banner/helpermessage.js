"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var bannerBase = require('./bannerbase');
var standardisationSctionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var classNames = require('classnames');
/**
 * Helper message component for blue banner with close button
 */
var HelperMessage = (function (_super) {
    __extends(HelperMessage, _super);
    function HelperMessage() {
        var _this = this;
        _super.apply(this, arguments);
        this.hideBanner = false;
        /**
         * on click on the close button
         */
        this.onCloseClick = function () {
            _this.hideBanner = true;
            standardisationSctionCreator.updateSelectToMarkHelperMessageVisibility(false);
            _this.setState({ renderedOn: Date.now() });
        };
    }
    /**
     * component did mount
     */
    HelperMessage.prototype.componentDidMount = function () {
        this.hideBanner = !standardisationSetupStore.instance.isSelectToMarkHelperVisible;
    };
    /**
     * Render method
     */
    HelperMessage.prototype.render = function () {
        this.hideBanner = !this.hideBanner ? !standardisationSetupStore.instance.isSelectToMarkHelperVisible : this.hideBanner;
        var classToApply = classNames('message-box help-message dark-msg float-msg top right callout ', { show: this.hideBanner === false }, { hide: this.hideBanner === true });
        return (React.createElement("div", {className: classToApply, id: this.props.id, key: this.props.key, role: this.props.role, "aria-hidden": this.props.isAriaHidden}, React.createElement("a", {id: 'selectResponsesBannerClose', key: 'selectResponsesBannerClose', href: 'javascript:void(0)', onClick: this.onCloseClick, className: 'close'}, React.createElement("span", {className: 'close-icon'})), React.createElement("p", {className: 'message-body'}, this.props.message)));
    };
    return HelperMessage;
}(bannerBase));
module.exports = HelperMessage;
//# sourceMappingURL=helpermessage.js.map