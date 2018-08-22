"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for Marks And Annotation Vibility status.
 */
var MarksAndAnnotationVibilityChangedAction = (function (_super) {
    __extends(MarksAndAnnotationVibilityChangedAction, _super);
    /**
     * Initializing a new instance of Marks And Annotation Vibility Changed Action.
     * @param data
     */
    function MarksAndAnnotationVibilityChangedAction(collectionIndex, data) {
        _super.call(this, action.Source.View, actionType.REMARK_ITEMS_DISPLAY_STATUS_CHANGED_ACTION);
        this._marksAndAnnotationsVisibilityInfo = data;
        this._collectionIndex = collectionIndex;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(MarksAndAnnotationVibilityChangedAction.prototype, "getMarksAndAnnotationsVisibilityInfo", {
        /*
        * return the visiblity info of a perticular marks and annotation collection
        */
        get: function () {
            return this._marksAndAnnotationsVisibilityInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarksAndAnnotationVibilityChangedAction.prototype, "getMarksAndAnnotationsCollectionIndexToChange", {
        /*
        * return the index of the marks and annotation collection to which the visibility need to be changed
        */
        get: function () {
            return this._collectionIndex;
        },
        enumerable: true,
        configurable: true
    });
    return MarksAndAnnotationVibilityChangedAction;
}(action));
module.exports = MarksAndAnnotationVibilityChangedAction;
//# sourceMappingURL=marksandannotationvibilitychangedaction.js.map