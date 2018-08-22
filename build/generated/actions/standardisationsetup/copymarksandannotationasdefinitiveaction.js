"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Copy marks and annotation as definitive action.
 */
var CopyMarksAndAnnotationAsDefinitiveAction = (function (_super) {
    __extends(CopyMarksAndAnnotationAsDefinitiveAction, _super);
    function CopyMarksAndAnnotationAsDefinitiveAction(success, isCopyMarkAsDef) {
        _super.call(this, action.Source.View, actionType.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE);
        this._isCopyMarkAsDef = isCopyMarkAsDef;
    }
    Object.defineProperty(CopyMarksAndAnnotationAsDefinitiveAction.prototype, "isCopyMarkAsDefinitive", {
        get: function () {
            return this._isCopyMarkAsDef;
        },
        enumerable: true,
        configurable: true
    });
    return CopyMarksAndAnnotationAsDefinitiveAction;
}(action));
module.exports = CopyMarksAndAnnotationAsDefinitiveAction;
//# sourceMappingURL=copymarksandannotationasdefinitiveaction.js.map