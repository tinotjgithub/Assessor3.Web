"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var DrawAnnotationAction = (function (_super) {
    __extends(DrawAnnotationAction, _super);
    /**
     * Constructor
     * @param annotationDrawStart
     */
    function DrawAnnotationAction(annotationDrawStart) {
        _super.call(this, action.Source.View, actionType.ANNOTATION_DRAW);
        var errorText = this.auditLog.logContent;
        this._annotationDrawStart = annotationDrawStart;
    }
    Object.defineProperty(DrawAnnotationAction.prototype, "isAnnotationDrawStart", {
        /**
         * Get Annotation
         */
        get: function () {
            return this._annotationDrawStart;
        },
        enumerable: true,
        configurable: true
    });
    return DrawAnnotationAction;
}(action));
module.exports = DrawAnnotationAction;
//# sourceMappingURL=drawannotationaction.js.map