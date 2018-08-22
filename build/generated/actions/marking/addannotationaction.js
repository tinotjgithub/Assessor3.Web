"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AddAnnotationAction = (function (_super) {
    __extends(AddAnnotationAction, _super);
    /**
     * Constructor
     * @param addedAnnotation
     */
    function AddAnnotationAction(addedAnnotation, annotationAction, annotationOverlayId, previousMarkIndex, isStitched, avoidEventEmition, isPageLinkedByPreviousMarker) {
        if (isStitched === void 0) { isStitched = false; }
        if (avoidEventEmition === void 0) { avoidEventEmition = false; }
        if (isPageLinkedByPreviousMarker === void 0) { isPageLinkedByPreviousMarker = false; }
        _super.call(this, action.Source.View, actionType.ADD_ANNOTATION);
        this._annotation = addedAnnotation;
        this._annotationAction = annotationAction !== undefined ? annotationAction : 0;
        this._annotationOverlayId = annotationOverlayId;
        this._previousMarkIndex = previousMarkIndex;
        this._isStitched = isStitched;
        this._avoidEventEmition = avoidEventEmition;
        this._isPageLinkedByPreviousMarker = isPageLinkedByPreviousMarker;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', addedAnnotation.annotationId.toString())
            .replace('{1}', addedAnnotation.markSchemeId.toString())
            .replace('{2}', addedAnnotation.markGroupId.toString())
            .replace('{3}', addedAnnotation.pageNo.toString())
            .replace('{4}', addedAnnotation.outputPageNo.toString())
            .replace('{5}', addedAnnotation.height.toString())
            .replace('{6}', addedAnnotation.width.toString())
            .replace('{7}', addedAnnotation.leftEdge.toString())
            .replace('{8}', addedAnnotation.blue.toString())
            .replace('{9}', addedAnnotation.green.toString())
            .replace('{10}', addedAnnotation.red.toString())
            .replace('{11}', this._annotationAction.toString())
            .replace('{12}', (previousMarkIndex ? previousMarkIndex : 0).toString());
    }
    Object.defineProperty(AddAnnotationAction.prototype, "annotationAction", {
        /**
         * Get Added Annotation Action
         */
        get: function () {
            return this._annotationAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddAnnotationAction.prototype, "isStitched", {
        /**
         * Get Added Annotation Action
         */
        get: function () {
            return this._isStitched;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddAnnotationAction.prototype, "annotation", {
        /**
         * Get Annotation
         */
        get: function () {
            return this._annotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddAnnotationAction.prototype, "annotationOverlayId", {
        /**
         * Get Annotation Overlay Id
         */
        get: function () {
            return this._annotationOverlayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddAnnotationAction.prototype, "previousMarkIndex", {
        /**
         * Get the previous mark index
         */
        get: function () {
            return this._previousMarkIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddAnnotationAction.prototype, "avoidEventEmition", {
        /**
         * Returning true for avoiding event emition
         */
        get: function () {
            return this._avoidEventEmition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddAnnotationAction.prototype, "isPageLinkedByPreviousMarker", {
        /**
         * Returning true if the page is linked by peviousmarker
         */
        get: function () {
            return this._isPageLinkedByPreviousMarker;
        },
        enumerable: true,
        configurable: true
    });
    return AddAnnotationAction;
}(action));
module.exports = AddAnnotationAction;
//# sourceMappingURL=addannotationaction.js.map