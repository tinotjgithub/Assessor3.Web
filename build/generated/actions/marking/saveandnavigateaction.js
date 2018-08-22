"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to save and navigate.
 */
var SaveAndNavigateAction = (function (_super) {
    __extends(SaveAndNavigateAction, _super);
    /**
     * Initializing a new instance of save and navigate class.
     * @param navigatingTo
     * @param navigationFrom
     */
    function SaveAndNavigateAction(navigatingTo, navigationFrom, showNavigationOnMbqPopup) {
        _super.call(this, action.Source.View, actionType.SAVE_AND_NAVIGATE);
        /**
         *  Checking whether we need to shoe the popup.
         */
        this._showNavigationOnMbqPopup = false;
        this._navigatingTo = navigatingTo;
        this._navigationFrom = navigationFrom;
        this._showNavigationOnMbqPopup = showNavigationOnMbqPopup;
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{navigatingTo}/g, navigatingTo.toString()).
            replace(/{navigatingFrom}/g, navigationFrom === undefined ? 'undefined' : navigationFrom.toString());
    }
    Object.defineProperty(SaveAndNavigateAction.prototype, "navigatingTo", {
        /**
         * Navigating from response to different view
         */
        get: function () {
            return this._navigatingTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveAndNavigateAction.prototype, "navigationFrom", {
        /* return where the navigations happens */
        get: function () {
            return this._navigationFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveAndNavigateAction.prototype, "showNavigationOnMbqPopup", {
        /* return the value when the response reach the last question item of the last response. */
        get: function () {
            return this._showNavigationOnMbqPopup;
        },
        enumerable: true,
        configurable: true
    });
    return SaveAndNavigateAction;
}(action));
module.exports = SaveAndNavigateAction;
//# sourceMappingURL=saveandnavigateaction.js.map