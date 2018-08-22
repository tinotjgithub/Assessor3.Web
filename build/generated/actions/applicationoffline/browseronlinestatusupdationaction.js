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
 * The class for updating online status of browser.
 * @param {boolean} success
 */
var BrowserOnlineStatusUpdationAction = (function (_super) {
    __extends(BrowserOnlineStatusUpdationAction, _super);
    /**
     * Constructor
     * @param onlineStatus
     */
    function BrowserOnlineStatusUpdationAction(onlineStatus, forceEmit) {
        if (forceEmit === void 0) { forceEmit = false; }
        _super.call(this, action.Source.View, actionType.UPDATE_BROWSER_ONLINE_STATUS, onlineStatus);
        this._isBrowserOnline = onlineStatus;
        this._forceEmit = forceEmit;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, onlineStatus.toString());
    }
    Object.defineProperty(BrowserOnlineStatusUpdationAction.prototype, "isOnline", {
        /**
         * Gets the browser online status.
         * @returns online status
         */
        get: function () {
            return this._isBrowserOnline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserOnlineStatusUpdationAction.prototype, "forceEmit", {
        /**
         * Gets is force emit or not
         */
        get: function () {
            return this._forceEmit;
        },
        enumerable: true,
        configurable: true
    });
    return BrowserOnlineStatusUpdationAction;
}(dataRetrievalAction));
module.exports = BrowserOnlineStatusUpdationAction;
//# sourceMappingURL=browseronlinestatusupdationaction.js.map