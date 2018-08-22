"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var stringHelper = require('../../utility/generic/stringhelper');
var RemoveAnnotationAction = (function (_super) {
    __extends(RemoveAnnotationAction, _super);
    /**
     * Constructor
     * @param removeAnnotationList
     * @param isPanAvoidImageContainerRender
     */
    function RemoveAnnotationAction(removeAnnotationList, isPanAvoidImageContainerRender, contextMenuType, isLinkAnnotation) {
        if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
        _super.call(this, action.Source.View, actionType.REMOVE_ANNOTATION);
        var errorText = this.auditLog.logContent;
        this._removeAnnotationList = removeAnnotationList;
        this._isPanAvoidImageContainerRender = isPanAvoidImageContainerRender;
        this._contextMenuType = contextMenuType;
        this._isLinkAnnotation = isLinkAnnotation;
        var removedAnnotations = '';
        removeAnnotationList.forEach(function (annotationToken) {
            removedAnnotations = removedAnnotations +
                ' | ' +
                stringHelper.format(errorText, [annotationToken]);
        });
        this.auditLog.logContent = removedAnnotations;
    }
    Object.defineProperty(RemoveAnnotationAction.prototype, "removeAnnotationList", {
        /**
         * Get Annotation
         */
        get: function () {
            return this._removeAnnotationList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveAnnotationAction.prototype, "isPanAvoidImageContainerRender", {
        /**
         * If PAN, avoid image container rerender
         */
        get: function () {
            return this._isPanAvoidImageContainerRender;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveAnnotationAction.prototype, "contextMenuType", {
        /**
         * If PAN, avoid image container rerender
         */
        get: function () {
            return this._contextMenuType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveAnnotationAction.prototype, "isLinkAnnotation", {
        /**
         * returns true, only if the if its a linked annotation.
         */
        get: function () {
            return this._isLinkAnnotation;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveAnnotationAction;
}(action));
module.exports = RemoveAnnotationAction;
//# sourceMappingURL=removeannotationaction.js.map