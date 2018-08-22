"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for Stamp Touch Action
 */
var StampPanAction = (function (_super) {
    __extends(StampPanAction, _super);
    /**
     * Constructor StampPanAction
     * @param stampId
     * @param draggedAnnotationClientToken
     */
    function StampPanAction(stampId, draggedAnnotationClientToken) {
        _super.call(this, action.Source.View, actionType.STAMP_PAN);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', stampId.toString());
        this._stampId = stampId;
        this._draggedAnnotationClientToken = draggedAnnotationClientToken;
    }
    Object.defineProperty(StampPanAction.prototype, "panStampId", {
        /**
         * This method will return the Stamp ID
         */
        get: function () {
            return this._stampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampPanAction.prototype, "draggedAnnotationClientToken", {
        /**
         * Get currently dragged annotation client token
         */
        get: function () {
            return this._draggedAnnotationClientToken;
        },
        enumerable: true,
        configurable: true
    });
    return StampPanAction;
}(action));
module.exports = StampPanAction;
//# sourceMappingURL=stamppanaction.js.map