"use strict";
/**
 * Creates a new class to hold notification data
 * @class
 */
var ActionNotificationInfo = (function () {
    /**
     * Initialise new instance of ActionNotificationInfo
     * @constructor
     */
    function ActionNotificationInfo() {
        this._unreadMessageCount = 0;
        this._exceptionMessageCount = 0;
        this._unreadMandatoryMessageCount = 0;
        this._coordinationComplete = false;
    }
    Object.defineProperty(ActionNotificationInfo.prototype, "getUnreadMessageCount", {
        /**
         * Get the  unread user message count
         * @returns  unread user message count
         */
        get: function () {
            return this._unreadMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "setUnreadMessageCount", {
        /**
         * Setting the unread user message count
         * @param {number} unreadMessageCount
         */
        set: function (unreadMessageCount) {
            this._unreadMessageCount = unreadMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "getExceptionMessageCount", {
        /**
         * Get the  exception message count
         * @returns exception message count
         */
        get: function () {
            return this._exceptionMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "setExceptionMessageCount", {
        /**
         * Setting the exception message count
         * @param {number} unreadMessageCount
         */
        set: function (exceptionMessageCount) {
            this._exceptionMessageCount = exceptionMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "getUnreadMandatoryMessageCount", {
        /**
         * Get the unread mandatory message count
         */
        get: function () {
            return this._unreadMandatoryMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "setUnreadMandatoryMessageCount", {
        /**
         * Set the unread mandatory message count
         */
        set: function (unreadCount) {
            this._unreadMandatoryMessageCount = unreadCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "getCoordinationCompleteBit", {
        /**
         * Gets the coordination comple bit
         */
        get: function () {
            return this._coordinationComplete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionNotificationInfo.prototype, "setCoordinationCompleteBit", {
        /**
         * Sets the coordination comple bit
         */
        set: function (value) {
            this._coordinationComplete = value;
        },
        enumerable: true,
        configurable: true
    });
    return ActionNotificationInfo;
}());
module.exports = ActionNotificationInfo;
//# sourceMappingURL=actionnotificationinfo.js.map