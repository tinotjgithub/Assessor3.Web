"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var counterpart = require('counterpart');
var storeBase = require('../base/storebase');
var ActionType = require('../../actions/base/actiontypes');
var constants = require('../../components/utility/constants');
/**
 * Store fore locale.
 */
var LocaleStore = (function (_super) {
    __extends(LocaleStore, _super);
    /**
     * @constructor
     */
    function LocaleStore() {
        var _this = this;
        _super.call(this);
        this.dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === ActionType.LOCALE) {
                _this.success = action.success;
                if (_this.success) {
                    /** registering the JSON corresponding to the selected locale and setting the same as current locale. */
                    _this.locale = action.getLocale;
                    _this.localeJson = action.getLocaleJson;
                    var getFallbackJson = action.getFallbackJson;
                    counterpart.registerTranslations(_this.locale, _this.localeJson);
                    counterpart.registerTranslations(constants.FALLBACK_LOCALE, getFallbackJson);
                    counterpart.setLocale(_this.locale);
                    counterpart.setFallbackLocale(constants.FALLBACK_LOCALE);
                    _this.emit(LocaleStore.LOCALE_CHANGE_EVENT);
                }
            }
        });
    }
    /**
     * returns the translated text based on the current locale.
     */
    LocaleStore.prototype.TranslateText = function (text) {
        /** If the corresponding language has not been downloaded return empty */
        if (this.locale !== undefined) {
            return counterpart.translate(text);
        }
        else {
            return '';
        }
    };
    Object.defineProperty(LocaleStore.prototype, "Locale", {
        /**
         * returns the current locale
         */
        get: function () {
            return this.locale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocaleStore.prototype, "LocaleJson", {
        /**
         * returns the JSON objcet corresponding to current locale
         */
        get: function () {
            return this.localeJson;
        },
        enumerable: true,
        configurable: true
    });
    LocaleStore.LOCALE_CHANGE_EVENT = 'localeChanged';
    return LocaleStore;
}(storeBase));
var instance = new LocaleStore();
module.exports = { LocaleStore: LocaleStore, instance: instance };
//# sourceMappingURL=localestore.js.map