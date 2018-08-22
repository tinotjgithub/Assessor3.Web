"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Update annotation action
 */
var UpdateAnnotationColorAction = (function (_super) {
    __extends(UpdateAnnotationColorAction, _super);
    /**
     * Constructor
     * @param currentAnnotation
     */
    function UpdateAnnotationColorAction(currentAnnotation) {
        _super.call(this, action.Source.View, actionType.UPDATE_ANNOTATION_COLOR);
        this._currentAnnotation = currentAnnotation;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', currentAnnotation.annotationId.toString())
            .replace('{1}', currentAnnotation.markSchemeId.toString())
            .replace('{2}', currentAnnotation.markGroupId.toString())
            .replace('{3}', currentAnnotation.pageNo.toString())
            .replace('{4}', currentAnnotation.outputPageNo.toString())
            .replace('{5}', currentAnnotation.height.toString())
            .replace('{6}', currentAnnotation.width.toString())
            .replace('{7}', currentAnnotation.leftEdge.toString())
            .replace('{8}', currentAnnotation.blue.toString())
            .replace('{9}', currentAnnotation.green.toString())
            .replace('{10}', currentAnnotation.red.toString())
            .replace('{11}', currentAnnotation.imageClusterId == null ? '' : currentAnnotation.imageClusterId.toString());
    }
    Object.defineProperty(UpdateAnnotationColorAction.prototype, "currentAnnotation", {
        /**
         * Get annotation.
         */
        get: function () {
            return this._currentAnnotation;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateAnnotationColorAction;
}(action));
module.exports = UpdateAnnotationColorAction;
//# sourceMappingURL=updateannotationcoloraction.js.map