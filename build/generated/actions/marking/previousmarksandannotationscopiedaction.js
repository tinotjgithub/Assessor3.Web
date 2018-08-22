"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var PreviousMarksAndAnnotationsCopiedAction = (function (_super) {
    __extends(PreviousMarksAndAnnotationsCopiedAction, _super);
    /**
     * Constructor
     */
    function PreviousMarksAndAnnotationsCopiedAction() {
        _super.call(this, action.Source.View, actionType.COPIED_PREVIOUS_MARKS_AND_ANNOTATIONS);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return PreviousMarksAndAnnotationsCopiedAction;
}(action));
module.exports = PreviousMarksAndAnnotationsCopiedAction;
//# sourceMappingURL=previousmarksandannotationscopiedaction.js.map