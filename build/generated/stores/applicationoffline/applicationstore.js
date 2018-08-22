"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var ApplicationStore = (function (_super) {
    __extends(ApplicationStore, _super);
    /**
     * @constructor
     */
    function ApplicationStore() {
        var _this = this;
        _super.call(this);
        this._isApplicationOnline = true;
        this._isApplicationOnlineCurrently = true;
        this._isApplicationOnlinePreviously = true;
        this._elapsedTime = undefined;
        this._allowNavigation = false;
        this._modulesToDownload = [];
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.UPDATE_BROWSER_ONLINE_STATUS:
                    var applicationStatusAction_1 = action;
                    var _isOnline = applicationStatusAction_1.isOnline;
                    // Avoiding duplicate emit.
                    if (_this._isApplicationOnline !== _isOnline || applicationStatusAction_1.forceEmit) {
                        _this._isApplicationOnline = _isOnline;
                        _this.emit(ApplicationStore.ONLINE_STATUS_UPDATED_EVENT);
                    }
                    if (_this._isApplicationOnline) {
                        _this._isApplicationOnlineCurrently = true;
                    }
                    else if (!_this._isApplicationOnline && _this._isApplicationOnlineCurrently) {
                        // Updating the elapsed time, only when the application status switches from Online to offline.
                        _this._elapsedTime = Date.now();
                        _this._isApplicationOnlineCurrently = false;
                    }
                    break;
                case actionType.ACTION_INTERRUPTED_ACTION:
                    _this._allowNavigation = action.allowNavigation;
                    _this.emit(ApplicationStore.ACTION_INTERRUPTED_EVENT, action.isFromLogout);
                    break;
                case actionType.DOWNLOAD_APPLICATION_MODULE_ACTION:
                    // clear the download collection as its completed download
                    if (action.moduleName === '') {
                        _this._modulesToDownload = [];
                    }
                    else {
                        _this._modulesToDownload.push(action.moduleName);
                    }
                    break;
            }
        });
    }
    Object.defineProperty(ApplicationStore.prototype, "isApplicationOnlinePreviously", {
        /**
         * Gets a value indicating whether the application was online or offline previously.
         * @returns
         */
        get: function () {
            return this._isApplicationOnlinePreviously;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationStore.prototype, "isOnline", {
        /**
         * Gets a value indicating whether the application is online or offline.
         * @returns
         */
        get: function () {
            return this._isApplicationOnline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationStore.prototype, "allowNavigation", {
        /**
         * Gets a value indicating whether the navigation is Needed.
         * @returns
         */
        get: function () {
            return this._allowNavigation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationStore.prototype, "elapsedTime", {
        /**
         * Gets a value indicating the elapsed time.
         * @returns
         */
        get: function () {
            return this._elapsedTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationStore.prototype, "modulesToDownload", {
        /**
         * Gets list of modules that is required to download
         * when application comes online
         * @returns
         */
        get: function () {
            return this._modulesToDownload;
        },
        enumerable: true,
        configurable: true
    });
    // Online status updated event .
    ApplicationStore.ONLINE_STATUS_UPDATED_EVENT = 'onlinestatusupdated';
    // Event name for distributing action has been interruptedny connection issues
    ApplicationStore.ACTION_INTERRUPTED_EVENT = 'actioninterruptedaction';
    // download response module
    ApplicationStore.RESPONSE_MODULE = 'responsemodule';
    return ApplicationStore;
}(storeBase));
var instance = new ApplicationStore();
module.exports = { ApplicationStore: ApplicationStore, instance: instance };
//# sourceMappingURL=applicationstore.js.map