"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for mark by annotation.
 */
var AddMarkByAnnotationAction = (function (_super) {
    __extends(AddMarkByAnnotationAction, _super);
    /**
     * constructor
     * @param addedAnnotation
     * @param annotationAction
     * @param annotationOverlayId
     */
    function AddMarkByAnnotationAction(addedAnnotation, annotationAction, annotationOverlayId) {
        _super.call(this, action.Source.View, actionType.ADD_MARK_BY_ANNOTATION_ACTION);
        this._annotation = addedAnnotation;
        this._action = annotationAction;
        this._annotationOverlayId = annotationOverlayId;
    }
    Object.defineProperty(AddMarkByAnnotationAction.prototype, "annotation", {
        /**
         * Gets added annotation.
         */
        get: function () {
            return this._annotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddMarkByAnnotationAction.prototype, "action", {
        /**
         * Gets annotation action.
         */
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddMarkByAnnotationAction.prototype, "annotationOverlayId", {
        /**
         * gets annotation overlayId
         */
        get: function () {
            return this._annotationOverlayId;
        },
        enumerable: true,
        configurable: true
    });
    return AddMarkByAnnotationAction;
}(action));
module.exports = AddMarkByAnnotationAction;
//# sourceMappingURL=addmarkbyannotationaction.js.map