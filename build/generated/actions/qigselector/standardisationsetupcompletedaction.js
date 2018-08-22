"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var StandardisationSetupCompletedAction = (function (_super) {
    __extends(StandardisationSetupCompletedAction, _super);
    /**
     * Constructor for standardisation setup completion
     * @param success
     * @param isStandardisationSetupCompleted
     * @param navigatedFrom
     * @param navigatedTo
     */
    function StandardisationSetupCompletedAction(success, isStandardisationSetupCompleted, navigatedFrom, navigatedTo) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SETUP_COMPLETED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isStandardisationSetupCompleted = isStandardisationSetupCompleted;
        this._navigatedFrom = navigatedFrom;
        this._navigatedTo = navigatedTo;
    }
    Object.defineProperty(StandardisationSetupCompletedAction.prototype, "isStandardisationSetupCompleted", {
        /**
         * Checking whether the standardisation setup is completed or not
         */
        get: function () {
            return this._isStandardisationSetupCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupCompletedAction.prototype, "navigatedFrom", {
        /**
         * Gets the container from which navigation happened
         */
        get: function () {
            return this._navigatedFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupCompletedAction.prototype, "navigatedTo", {
        /**
         * Gets the container to navigate to
         */
        get: function () {
            return this._navigatedTo;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationSetupCompletedAction;
}(dataRetrievalAction));
module.exports = StandardisationSetupCompletedAction;
//# sourceMappingURL=standardisationsetupcompletedaction.js.map