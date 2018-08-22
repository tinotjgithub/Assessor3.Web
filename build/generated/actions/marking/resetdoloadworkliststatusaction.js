"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for resetting status of loading worklist
 */
var ResetDoLoadWorklistStatusAction = (function (_super) {
    __extends(ResetDoLoadWorklistStatusAction, _super);
    /**
     * Consturctor
     * @param doLoadCurrentExaminerWorklist
     */
    function ResetDoLoadWorklistStatusAction(doLoadCurrentExaminerWorklist) {
        _super.call(this, action.Source.View, actionType.RESET_DO_LOAD_WORKLIST_STATUS_ACTION);
        this._doLoadCurrentExaminerWorklist = doLoadCurrentExaminerWorklist;
    }
    Object.defineProperty(ResetDoLoadWorklistStatusAction.prototype, "doLoadCurrentExaminerWorklist", {
        /**
         *  Returns the status whether to load examiner worklist or dont
         */
        get: function () {
            return this._doLoadCurrentExaminerWorklist;
        },
        enumerable: true,
        configurable: true
    });
    return ResetDoLoadWorklistStatusAction;
}(action));
module.exports = ResetDoLoadWorklistStatusAction;
//# sourceMappingURL=resetdoloadworkliststatusaction.js.map