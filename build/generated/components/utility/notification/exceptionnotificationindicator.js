"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Represents the exception notification indicator component
 */
var ExceptionNotificationIndicator = (function (_super) {
    __extends(ExceptionNotificationIndicator, _super);
    /**
     * @constructor
     */
    function ExceptionNotificationIndicator(properties, state) {
        _super.call(this, properties, state);
    }
    /**
     * Render method
     */
    ExceptionNotificationIndicator.prototype.render = function () {
        return (React.createElement("li", {role: 'menuitem', className: 'exception'}, React.createElement("a", {id: this.props.id, href: 'javascript:void(0)', title: localeStore.instance.TranslateText('assessor3.notificationindicator.exception')}, React.createElement("span", {className: 'relative'}, this.getExceptionMessageCountRenderer(), React.createElement("span", {className: 'sprite-icon info-icon-light-small'}), React.createElement("span", {className: 'nav-text'}, localeStore.instance.TranslateText('assessor3.worklist.exception-text'))))));
    };
    /**
     * Get's the exception count span div if exception is available for the logged in examiner
     */
    ExceptionNotificationIndicator.prototype.getExceptionMessageCountRenderer = function () {
        if (this.props.exceptionNotificationCount > 0) {
            return React.createElement("span", {className: 'notification-count notification circle'}, (this.props.exceptionNotificationCount).toLocaleString(localeStore.instance.Locale));
        }
    };
    return ExceptionNotificationIndicator;
}(pureRenderComponent));
module.exports = ExceptionNotificationIndicator;
//# sourceMappingURL=exceptionnotificationindicator.js.map