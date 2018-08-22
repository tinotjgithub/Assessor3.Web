"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for triggering saving of marks and Annotations action.
 */
var TriggerSavingMarksAndAnnotationsAction = (function (_super) {
    __extends(TriggerSavingMarksAndAnnotationsAction, _super);
    /**
     * Constructor TriggerSavingMarksAndAnnotationsAction
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param success
     */
    function TriggerSavingMarksAndAnnotationsAction(saveMarksAndAnnotationTriggeringPoint, success) {
        _super.call(this, action.Source.View, actionType.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS);
        this._saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(TriggerSavingMarksAndAnnotationsAction.prototype, "saveMarksAndAnnotationTriggeringPoint", {
        /**
         * returns the saveMarksAndAnnotationTriggeringPoint
         */
        get: function () {
            return this._saveMarksAndAnnotationTriggeringPoint;
        },
        enumerable: true,
        configurable: true
    });
    return TriggerSavingMarksAndAnnotationsAction;
}(action));
module.exports = TriggerSavingMarksAndAnnotationsAction;
//# sourceMappingURL=triggersavingmarksandannotationsaction.js.map