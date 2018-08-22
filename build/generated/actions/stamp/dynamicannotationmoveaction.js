"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var DynamicAnnotationMoveAction = (function (_super) {
    __extends(DynamicAnnotationMoveAction, _super);
    function DynamicAnnotationMoveAction(isAnnotationActive) {
        _super.call(this, action.Source.View, actionType.DYNAMIC_ANNOTATION_DRAGGING);
        this._isAnnotationActive = isAnnotationActive;
    }
    Object.defineProperty(DynamicAnnotationMoveAction.prototype, "isAnnotationActive", {
        get: function () {
            return this._isAnnotationActive;
        },
        enumerable: true,
        configurable: true
    });
    return DynamicAnnotationMoveAction;
}(action));
module.exports = DynamicAnnotationMoveAction;
//# sourceMappingURL=dynamicannotationmoveaction.js.map