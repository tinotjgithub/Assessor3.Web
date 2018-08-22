"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var dataRetrievalAction = require('../base/dataretrievalaction');
var SamplingStatusChangeAction = (function (_super) {
    __extends(SamplingStatusChangeAction, _super);
    /**
     * Constructor SamplingStatusChangeAction
     * @param success
     * @param supervisorSamplingCommentReturn
     */
    function SamplingStatusChangeAction(success, supervisorSamplingCommentReturn, displayId) {
        _super.call(this, action.Source.View, actionType.SAMPLING_STATUS_CHANGE_ACTION, success);
        this._supervisorSamplingCommentReturn = supervisorSamplingCommentReturn;
        this._displayId = displayId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(SamplingStatusChangeAction.prototype, "supervisorSamplingCommentReturn", {
        /**
         * This method will returns supervisor sampling Comment Return details
         */
        get: function () {
            return this._supervisorSamplingCommentReturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SamplingStatusChangeAction.prototype, "displayId", {
        /**
         * This method will returns displayId
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    return SamplingStatusChangeAction;
}(dataRetrievalAction));
module.exports = SamplingStatusChangeAction;
//# sourceMappingURL=samplingstatuschangeaction.js.map