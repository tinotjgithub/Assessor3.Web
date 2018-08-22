"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateDisplayAngleOfResponseAction = (function (_super) {
    __extends(UpdateDisplayAngleOfResponseAction, _super);
    /**
     * Constructor UpdateDisplayAngleOfResponseAction
     * @param displayAngle
     * @param responseId
     * @param reset
     */
    function UpdateDisplayAngleOfResponseAction(displayAngle, responseId, reset) {
        _super.call(this, action.Source.View, actionType.UPDATE_DISPLAY_ANGLE_OF_RESPONSE);
        this.auditLog.logContent = this.auditLog.logContent.replace('{direction}', displayAngle ? displayAngle.toString() : '0')
            .replace('{responseid}', responseId);
        this._displayAngle = displayAngle;
        this._responseId = responseId;
        this._reset = reset;
    }
    Object.defineProperty(UpdateDisplayAngleOfResponseAction.prototype, "displayAngle", {
        get: function () {
            return this._displayAngle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateDisplayAngleOfResponseAction.prototype, "responseId", {
        get: function () {
            return this._responseId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateDisplayAngleOfResponseAction.prototype, "canReset", {
        get: function () {
            return this._reset;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateDisplayAngleOfResponseAction;
}(action));
module.exports = UpdateDisplayAngleOfResponseAction;
//# sourceMappingURL=updatedisplayangleofresponseaction.js.map