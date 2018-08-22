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
 * Action for updating marking progress.
 */
var UpdateMarkingProgressAction = (function (_super) {
    __extends(UpdateMarkingProgressAction, _super);
    /**
     * Initializing a new instance of UpdateMarkingProgressAction.
     * @param {boolean} success
     */
    function UpdateMarkingProgressAction(markingProgress, success) {
        _super.call(this, action.Source.View, actionType.UPDATE_MARKING_PROGRESS, success);
        this._initialMarkingProgress = markingProgress;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markingProgress}/g, markingProgress.toString());
    }
    Object.defineProperty(UpdateMarkingProgressAction.prototype, "initialMarkingProgress", {
        /**
         * getting iniial marking progress
         * @param {number} _initialMarkingProgress
         */
        get: function () {
            return this._initialMarkingProgress;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateMarkingProgressAction;
}(dataRetrievalAction));
module.exports = UpdateMarkingProgressAction;
//# sourceMappingURL=updatemarkingprogressaction.js.map