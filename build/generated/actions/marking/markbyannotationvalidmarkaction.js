"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for annotation mark exceed action.
 */
var MarkByAnnotationValidMarkAction = (function (_super) {
    __extends(MarkByAnnotationValidMarkAction, _super);
    /**
     * constructor
     */
    function MarkByAnnotationValidMarkAction(newannotation, annotaitonAction, annotationOverlayID) {
        _super.call(this, action.Source.View, actionType.VALID_MARK);
        this._annotation = newannotation;
        this._annotationAction = annotaitonAction;
        this._annotationOverlayID = annotationOverlayID;
    }
    Object.defineProperty(MarkByAnnotationValidMarkAction.prototype, "annotationAction", {
        /**
         * Get Added Annotation Action
         */
        get: function () {
            return this._annotationAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkByAnnotationValidMarkAction.prototype, "annotation", {
        /**
         * Get Annotation
         */
        get: function () {
            return this._annotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkByAnnotationValidMarkAction.prototype, "annotationOverlayID", {
        /*
        * gets annotation oerlay id
        */
        get: function () {
            return this._annotationOverlayID;
        },
        enumerable: true,
        configurable: true
    });
    return MarkByAnnotationValidMarkAction;
}(action));
module.exports = MarkByAnnotationValidMarkAction;
//# sourceMappingURL=markbyannotationvalidmarkaction.js.map