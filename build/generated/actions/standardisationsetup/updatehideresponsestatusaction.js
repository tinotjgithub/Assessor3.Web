"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateHideResponseStatusAction = (function (_super) {
    __extends(UpdateHideResponseStatusAction, _super);
    /**
     * Constructore.
     * @param success
     * @param isHideStatusCompleted
     * @param displayId
     * @param isActiveStatus
     */
    function UpdateHideResponseStatusAction(success, isHideStatusCompleted, displayId, isActiveStatus) {
        _super.call(this, action.Source.View, actionType.UPDATE_HIDE_RESPONSE_STATUS);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._displayID = displayId;
        this._isActiveStatus = isActiveStatus;
    }
    Object.defineProperty(UpdateHideResponseStatusAction.prototype, "UpdatedResponseDisplayId", {
        /**
         * returns the UpdatedResponseDisplayId
         */
        get: function () {
            return this._displayID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateHideResponseStatusAction.prototype, "UpdatedResponseHiddenStatus", {
        /**
         * returns the UpdatedResponseHiddenStatus
         */
        get: function () {
            return !this._isActiveStatus;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateHideResponseStatusAction;
}(action));
module.exports = UpdateHideResponseStatusAction;
//# sourceMappingURL=updatehideresponsestatusaction.js.map