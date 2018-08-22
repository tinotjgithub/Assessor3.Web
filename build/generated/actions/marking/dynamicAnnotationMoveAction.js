"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to update the moving element properties
 */
var DynamicAnnotationMoveAction = (function (_super) {
    __extends(DynamicAnnotationMoveAction, _super);
    /**
     * Initializing a new instance.
     */
    function DynamicAnnotationMoveAction(movingElementProperties) {
        _super.call(this, action.Source.View, actionType.DYNAMIC_ANNOTATION_MOVE);
        this._movingElementProperties = movingElementProperties;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', movingElementProperties.visible.toString());
    }
    Object.defineProperty(DynamicAnnotationMoveAction.prototype, "movingElementProperties", {
        /**
         * movingElementProperties property
         */
        get: function () {
            return this._movingElementProperties;
        },
        enumerable: true,
        configurable: true
    });
    return DynamicAnnotationMoveAction;
}(action));
module.exports = DynamicAnnotationMoveAction;
//# sourceMappingURL=dynamicAnnotationMoveAction.js.map