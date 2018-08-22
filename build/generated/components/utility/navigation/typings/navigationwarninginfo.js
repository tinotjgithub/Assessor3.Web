"use strict";
var NavigationWarningInfo = (function () {
    function NavigationWarningInfo() {
    }
    Object.defineProperty(NavigationWarningInfo.prototype, "warningMessageHeader", {
        get: function () {
            return this._warningMessageHeader;
        },
        set: function (_warningMessageHeader) {
            this._warningMessageHeader = _warningMessageHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationWarningInfo.prototype, "warningMessageContent", {
        get: function () {
            return this._warningMessageContent;
        },
        set: function (_warningMessageContent) {
            this._warningMessageContent = _warningMessageContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationWarningInfo.prototype, "warningMessageNoButtonText", {
        get: function () {
            return this._warningMessageNoButtonText;
        },
        set: function (_warningMessageNoButtonText) {
            this._warningMessageNoButtonText = _warningMessageNoButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationWarningInfo.prototype, "warningMessageYesButtonText", {
        get: function () {
            return this._warningMessageYesButtonText;
        },
        set: function (_warningMessageYesButtonText) {
            this._warningMessageYesButtonText = _warningMessageYesButtonText;
        },
        enumerable: true,
        configurable: true
    });
    return NavigationWarningInfo;
}());
module.exports = NavigationWarningInfo;
//# sourceMappingURL=navigationwarninginfo.js.map