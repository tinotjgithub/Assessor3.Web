"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Action class for Locale.
 */
var LocaleAction = (function (_super) {
    __extends(LocaleAction, _super);
    /**
     * @constructor
     */
    function LocaleAction(success, locale, localeJson, fallbackJson) {
        _super.call(this, action.Source.View, actionType.LOCALE, success);
        this.locale = locale;
        this.localeJson = localeJson;
        this.fallbackJson = fallbackJson;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(LocaleAction.prototype, "getLocale", {
        /**
         * returns the locale
         */
        get: function () {
            return this.locale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocaleAction.prototype, "getLocaleJson", {
        /**
         * returns the json objcet corresponding to currently selected locale
         */
        get: function () {
            return this.localeJson;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocaleAction.prototype, "getFallbackJson", {
        /**
         * returns the json objcet corresponding to fallback locale
         */
        get: function () {
            return this.fallbackJson;
        },
        enumerable: true,
        configurable: true
    });
    return LocaleAction;
}(dataRetrievalAction));
module.exports = LocaleAction;
//# sourceMappingURL=localeaction.js.map