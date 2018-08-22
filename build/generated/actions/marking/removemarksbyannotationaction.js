"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var RemoveMarksByAnnotationAction = (function (_super) {
    __extends(RemoveMarksByAnnotationAction, _super);
    /**
     * Constructor
     * @param removeAnnotationList
     */
    function RemoveMarksByAnnotationAction(removedAnnotation) {
        _super.call(this, action.Source.View, actionType.REMOVE_ANNOTATION_MARK);
        this._removedAnnotation = removedAnnotation;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{stamp}/g, removedAnnotation.stamp.toString());
    }
    Object.defineProperty(RemoveMarksByAnnotationAction.prototype, "removedAnnotation", {
        /**
         * Get selected Annotation
         */
        get: function () {
            return this._removedAnnotation;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveMarksByAnnotationAction;
}(action));
module.exports = RemoveMarksByAnnotationAction;
//# sourceMappingURL=removemarksbyannotationaction.js.map