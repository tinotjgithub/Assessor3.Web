"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var actionInterruptedAction = require('./actoninterruptedaction');
var downloadapplicationmoduleaction = require('./downloadapplicationmoduleaction');
var ApplicationActionCreator = (function (_super) {
    __extends(ApplicationActionCreator, _super);
    function ApplicationActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * This will update the online status of the browser.
     * check whether the browser is connected to a internet/network or not.
     * @param onlineStatus
     */
    ApplicationActionCreator.prototype.updateOnlineStatus = function () {
        this.invokeOnlineStatusUpdate(false);
    };
    /**
     * Check whether the call was interrupted due to network failure
     * @returns whether action interrupted or not
     */
    ApplicationActionCreator.prototype.checkActionInterrupted = function () {
        if (this.isOnline) {
            return true;
        }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new actionInterruptedAction());
        });
        return false;
    };
    /**
     * Download the bundles when coming online
     * @param {Array<string>} modules
     */
    ApplicationActionCreator.prototype.downloadModlules = function (modules) {
        this.serviceInstance.downloadModules(modules).then(function () {
            dispatcher.dispatch(new downloadapplicationmoduleaction(''));
        });
    };
    /**
     * queue application module to preseve the name to download when application
     * comes online.
     * @param {string} moduleName
     */
    ApplicationActionCreator.prototype.enqueApplicationModuleDownload = function (moduleName) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new downloadapplicationmoduleaction(moduleName));
        });
    };
    return ApplicationActionCreator;
}(base));
var applicationActionCreator = new ApplicationActionCreator();
module.exports = applicationActionCreator;
//# sourceMappingURL=applicationactioncreator.js.map