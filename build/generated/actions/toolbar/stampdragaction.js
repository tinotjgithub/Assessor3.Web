"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for Stamp Select Action
 */
var StampDragAction = (function (_super) {
    __extends(StampDragAction, _super);
    /**
     * Constructor StampDragAction
     * @param stampId
     * @param isDrag
     */
    function StampDragAction(stampId, isDrag) {
        _super.call(this, action.Source.View, actionType.STAMP_DRAG);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isDrag ? 'Drag stamp' : 'Drag end stamp' + stampId);
        this._draggedStampId = stampId;
        this._isStampDragged = isDrag;
    }
    Object.defineProperty(StampDragAction.prototype, "draggedStampId", {
        /**
         * This method will return the Stamp ID
         */
        get: function () {
            return this._draggedStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampDragAction.prototype, "isStampDragged", {
        /**
         * This method will return if a stamp is dragged or not
         */
        get: function () {
            return this._isStampDragged;
        },
        enumerable: true,
        configurable: true
    });
    return StampDragAction;
}(action));
module.exports = StampDragAction;
//# sourceMappingURL=stampdragaction.js.map