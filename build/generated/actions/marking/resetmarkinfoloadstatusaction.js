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
 * The Action class for dispatching loading reset statuses(before making call reseting the load status flag)
 *  of markshemestructure and marks in markschemestructurestore and markingstore respectively.
 */
var ResetMarkInfoLoadStatusAction = (function (_super) {
    __extends(ResetMarkInfoLoadStatusAction, _super);
    /**
     * Initializing a new instance of MarkInfoResetArguments action.
     * @param {boolean} success
     */
    function ResetMarkInfoLoadStatusAction(isMarkSchemeReset) {
        _super.call(this, action.Source.View, actionType.RESET_MARK_INFO_LOAD_STATUS, isMarkSchemeReset);
        this.isMarkSchemeReset = isMarkSchemeReset;
    }
    Object.defineProperty(ResetMarkInfoLoadStatusAction.prototype, "resetMarkSchemeLoadStatus", {
        /**
         * resetMarkingInfoStatus
         * @returns
         */
        get: function () {
            return this.isMarkSchemeReset;
        },
        enumerable: true,
        configurable: true
    });
    return ResetMarkInfoLoadStatusAction;
}(dataRetrievalAction));
module.exports = ResetMarkInfoLoadStatusAction;
//# sourceMappingURL=resetmarkinfoloadstatusaction.js.map