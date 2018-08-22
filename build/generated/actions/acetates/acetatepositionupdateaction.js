"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to update the acetate moving element properties
 */
var AcetatePositionUpdateAction = (function (_super) {
    __extends(AcetatePositionUpdateAction, _super);
    /**
     * Initializing a new instance.
     */
    function AcetatePositionUpdateAction(acetate, acetateAction) {
        _super.call(this, action.Source.View, actionType.ACETATE_POSITION_UPDATE_ACTION);
        this._acetate = acetate;
        this._action = acetateAction;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', acetate.clientToken);
    }
    Object.defineProperty(AcetatePositionUpdateAction.prototype, "acetate", {
        /**
         * get acetate property
         */
        get: function () {
            return this._acetate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AcetatePositionUpdateAction.prototype, "acetateAction", {
        /**
         * get acetate action
         */
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    return AcetatePositionUpdateAction;
}(action));
module.exports = AcetatePositionUpdateAction;
//# sourceMappingURL=acetatepositionupdateaction.js.map