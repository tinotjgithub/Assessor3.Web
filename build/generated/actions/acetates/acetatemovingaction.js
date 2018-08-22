"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 *  The add or update acetate action.
 */
var AcetateMovingAction = (function (_super) {
    __extends(AcetateMovingAction, _super);
    /**
     * Constructor for the action.
     * @param clientToken
     * @param isMoving
     */
    function AcetateMovingAction(clientToken, isMoving) {
        _super.call(this, action.Source.View, actionType.ACETATE_MOVING_ACTION);
        this._isMoving = false;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', clientToken)
            .replace('{1}', isMoving.toString());
        this._isMoving = isMoving;
    }
    Object.defineProperty(AcetateMovingAction.prototype, "isMoving", {
        /* return true acetate is moving */
        get: function () {
            return this._isMoving;
        },
        enumerable: true,
        configurable: true
    });
    return AcetateMovingAction;
}(action));
module.exports = AcetateMovingAction;
//# sourceMappingURL=acetatemovingaction.js.map