"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var enums = require('../../components/utility/enums');
/**
 * Class for Rotate Response Action
 */
var RotateAction = (function (_super) {
    __extends(RotateAction, _super);
    /**
     * Constructor RotateAction
     * @param responseViewSettings
     * @param actionType
     */
    function RotateAction(responseViewSettings, actionType) {
        _super.call(this, action.Source.View, actionType);
        this.auditLog.logContent = this.auditLog.logContent.replace('{direction}', enums.ResponseViewSettings[responseViewSettings]);
        this._rotationType = responseViewSettings;
    }
    Object.defineProperty(RotateAction.prototype, "rotationType", {
        /**
         * This method will return the Rotate Type
         */
        get: function () {
            return this._rotationType;
        },
        enumerable: true,
        configurable: true
    });
    return RotateAction;
}(action));
module.exports = RotateAction;
//# sourceMappingURL=rotateresponseaction.js.map