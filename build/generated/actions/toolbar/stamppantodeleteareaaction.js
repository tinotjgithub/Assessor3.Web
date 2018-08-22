"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for StampPanToDeleteAreaAction
 */
var StampPanToDeleteAreaAction = (function (_super) {
    __extends(StampPanToDeleteAreaAction, _super);
    /**
     * Constructor StampPanToDeleteAreaAction
     * @param canDelete
     * @param xPos
     * @param yPos
     */
    function StampPanToDeleteAreaAction(canDelete, xPos, yPos) {
        _super.call(this, action.Source.View, actionType.PAN_STAMP_TO_DELETED_AREA);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', canDelete ? 'inside' : 'outside');
        this._canDelete = canDelete;
        this._xPos = xPos;
        this._yPos = yPos;
    }
    Object.defineProperty(StampPanToDeleteAreaAction.prototype, "canDelete", {
        /**
         * This will return if the annotation can be deleted or not
         */
        get: function () {
            return this._canDelete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampPanToDeleteAreaAction.prototype, "xPos", {
        /**
         * This will return the X-Coordinate position of the cursor
         */
        get: function () {
            return this._xPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampPanToDeleteAreaAction.prototype, "yPos", {
        /**
         * This will return the Y-Coordinate position of the cursor
         */
        get: function () {
            return this._yPos;
        },
        enumerable: true,
        configurable: true
    });
    return StampPanToDeleteAreaAction;
}(action));
module.exports = StampPanToDeleteAreaAction;
//# sourceMappingURL=stamppantodeleteareaaction.js.map