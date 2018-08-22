"use strict";
var serviceErrorReturn = require('../../dataservices/base/serviceerrorreturn');
var concurrentSessionErrorReturn = require('../../dataservices/base//concurrentsessionerrorreturn');
var enums = require('../../components/utility/enums');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var Promise = require('es6-promise');
var dispatcher = require('../../app/dispatcher');
var browserOnlineStatusUpdationAction = require('../applicationoffline/browseronlinestatusupdationaction');
var applicationDS = require('../../dataservices/applicationoffline/applicationdataservice');
var actonInterruptedAction = require('../applicationoffline/actoninterruptedaction');
var notifyConcurrentSessionActive = require('../../actions/login/notifyconcurrentsessionactive');
var validationAction = require('../teammanagement/validationaction');
/**
 * Class for holding common activities of action creator.
 */
var ActionCreatorBase = (function () {
    function ActionCreatorBase() {
    }
    /**
     * Indicating whether the dataservice call is from network error.
     * then update the ping poll interval to check when the network comes online.
     * @param {any} resultData
     */
    ActionCreatorBase.prototype.validateCall = function (resultData, allowNavigation, showMsgOnFailure, warningmessageaction, isFromLogout, isFromMyTeam) {
        if (allowNavigation === void 0) { allowNavigation = false; }
        if (showMsgOnFailure === void 0) { showMsgOnFailure = false; }
        if (warningmessageaction === void 0) { warningmessageaction = enums.WarningMessageAction.None; }
        if (isFromLogout === void 0) { isFromLogout = false; }
        if (isFromMyTeam === void 0) { isFromMyTeam = false; }
        var isValid = true;
        if (resultData && resultData instanceof concurrentSessionErrorReturn) {
            this.informConcurrentSessionActive();
            isValid = false;
        }
        else if (resultData &&
            resultData instanceof serviceErrorReturn &&
            resultData.errorType === enums.DataServiceRequestErrorType.NetworkError) {
            isValid = false;
            //applicationActionCreator.updateOnlineStatus(true);
            this.invokeOnlineStatusUpdate(true, allowNavigation, showMsgOnFailure, isFromLogout);
        }
        else if (resultData && resultData.failureCode &&
            resultData.failureCode !== enums.FailureCode.None &&
            warningmessageaction !== enums.WarningMessageAction.None) {
            isValid = false;
            // If any failure code return it will invoke failure status update to handle warning message.
            this.invokeFailureStatusUpdate(resultData.failureCode, warningmessageaction);
        }
        else if (isFromMyTeam && resultData.length === 0) {
            //If myteamData is null due to heirachy change it will invoke a warning message.
            this.invokeFailureStatusUpdate(enums.FailureCode.NotTeamLead, enums.WarningMessageAction.MyTeamAction);
        }
        return isValid;
    };
    Object.defineProperty(ActionCreatorBase.prototype, "isOnline", {
        /**
         * Gets a value indicating whether the application is online.
         */
        get: function () {
            return applicationStore.instance.isOnline;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * updates the online status
     * @param {boolean = false} isError
     * @param {boolean = false} showMsgOnFailure
     */
    ActionCreatorBase.prototype.invokeOnlineStatusUpdate = function (isError, allowNavigation, showMsgOnFailure, isFromLogout) {
        if (isError === void 0) { isError = false; }
        if (allowNavigation === void 0) { allowNavigation = false; }
        if (showMsgOnFailure === void 0) { showMsgOnFailure = false; }
        if (isFromLogout === void 0) { isFromLogout = false; }
        // If any other dataservice call has been falied due to network error
        // straight away set the flag to false, else allow ping method to execute
        if (isError) {
            new Promise.Promise(function (resolve, reject) {
                resolve();
            }).then(function () {
                dispatcher.dispatch(new browserOnlineStatusUpdationAction(false));
            }).then(function () {
                if (showMsgOnFailure) {
                    dispatcher.dispatch(new actonInterruptedAction(allowNavigation, isFromLogout));
                }
            });
        }
        else {
            this.validateNetWorkStatus();
        }
    };
    /**
     * updates the failure code status
     * @param {failurecode}
     * @param {warningmessageaction}
     */
    ActionCreatorBase.prototype.invokeFailureStatusUpdate = function (failureCode, warningMessageAction) {
        dispatcher.dispatch(new validationAction(failureCode, warningMessageAction));
    };
    Object.defineProperty(ActionCreatorBase.prototype, "serviceInstance", {
        /**
         * Gets application dataservice instance
         * @returns application dataservice instance
         */
        get: function () {
            return applicationDS;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * inform whether the current session is active or not.
     */
    ActionCreatorBase.prototype.informConcurrentSessionActive = function () {
        dispatcher.dispatch(new notifyConcurrentSessionActive());
    };
    /**
     * Check we have an open network
     */
    ActionCreatorBase.prototype.validateNetWorkStatus = function (forceEmit) {
        var _this = this;
        if (forceEmit === void 0) { forceEmit = false; }
        applicationDS.ping(function (success, json) {
            if (json && json instanceof concurrentSessionErrorReturn) {
                _this.informConcurrentSessionActive();
            }
            else {
                dispatcher.dispatch(new browserOnlineStatusUpdationAction(success, forceEmit));
            }
        });
    };
    return ActionCreatorBase;
}());
module.exports = ActionCreatorBase;
//# sourceMappingURL=actioncreatorbase.js.map