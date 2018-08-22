"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ResetMarksAndAnnotationAction = (function (_super) {
    __extends(ResetMarksAndAnnotationAction, _super);
    /**
     * @Constructor
     * @param {boolean} resetMarks
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    function ResetMarksAndAnnotationAction(resetMarks, resetAnnotation, previousMark) {
        _super.call(this, action.Source.View, actionType.RESET_MARKS_AND_ANNOTATION);
        this._resetMarks = resetMarks;
        this._resetAnnotation = resetAnnotation;
        this._previousMark = previousMark;
        // Adding audit log
        //this.auditLog.logContent = this.auditLog.logContent
        //                                .replace(/{0}/g, this._resetMarks.toString())
        //                                .replace(/{1}/g, this._resetAnnotation.toString());
    }
    Object.defineProperty(ResetMarksAndAnnotationAction.prototype, "resetMarks", {
        /**
         * Indicates whethe we need to reset the marks
         * @returns
         */
        get: function () {
            return this._resetMarks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResetMarksAndAnnotationAction.prototype, "resetAnnotation", {
        /**
         * Indicates whethe we need to reset the marks
         * @returns
         */
        get: function () {
            return this._resetAnnotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResetMarksAndAnnotationAction.prototype, "previousMark", {
        /**
         * holds the value which is to be retained while
         * clicking NO in reset Confirmation PopUp
         * @returns
         */
        get: function () {
            return this._previousMark;
        },
        enumerable: true,
        configurable: true
    });
    return ResetMarksAndAnnotationAction;
}(action));
module.exports = ResetMarksAndAnnotationAction;
//# sourceMappingURL=resetmarksandannotationaction.js.map