"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for removing response from collection.
 */
var UpdateResponseAction = (function (_super) {
    __extends(UpdateResponseAction, _super);
    /**
     * Constructor UpdateResponseAction
     */
    function UpdateResponseAction(markGroupId, worklistType) {
        _super.call(this, action.Source.View, actionType.REJECT_RIG_REMOVE_RESPONSE_ACTION);
        this._worklistType = worklistType;
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroup_ID}/g, markGroupId.toString());
    }
    Object.defineProperty(UpdateResponseAction.prototype, "markGroupID", {
        /**
         * return mark group id.
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateResponseAction.prototype, "worklistType", {
        /**
         * return worklist type.
         */
        get: function () {
            return this._worklistType;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateResponseAction;
}(action));
module.exports = UpdateResponseAction;
//# sourceMappingURL=updateresponseaction.js.map