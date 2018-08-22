"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var navigationHelper = require('../utility/navigation/navigationhelper');
/**
 * Represents the Awarding notification indicator component
 */
var AwardingIndicator = (function (_super) {
    __extends(AwardingIndicator, _super);
    /**
     * @constructor
     */
    function AwardingIndicator(properties, state) {
        _super.call(this, properties, state);
        /**
         * on Awarding Indicator Click method
         */
        this.onAwardingIndicatorClick = function () {
            navigationHelper.loadAwardingPage();
        };
    }
    /**
     * Render method
     */
    AwardingIndicator.prototype.render = function () {
        return (React.createElement("li", {role: 'menuitem'}, React.createElement("a", {id: this.props.id, href: 'javascript:void(0)', title: localeStore.instance.TranslateText('awarding.generic.awarding'), onClick: this.onAwardingIndicatorClick}, React.createElement("span", {className: 'relative'}, React.createElement("span", {id: 'awardingNotification', className: this.props.hasAwardingJudgement ? 'notification-dot notify' : 'notification-dot'}, React.createElement("span", {className: 'sprite-icon awarding-star-icon'})), React.createElement("span", {className: 'nav-text'}, localeStore.instance.TranslateText('awarding.generic.awarding-text'))))));
    };
    return AwardingIndicator;
}(pureRenderComponent));
module.exports = AwardingIndicator;
//# sourceMappingURL=awardingindicator.js.map