"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Action class for clearing marks and annotations data from store
 */
var ClearMarksAndAnnotationsAction = (function (_super) {
    __extends(ClearMarksAndAnnotationsAction, _super);
    /**
     * Constructor ClearMarksAndAnnotationsAction
     * @param markGroupId
     * @param success
     */
    function ClearMarksAndAnnotationsAction(markGroupId, success) {
        _super.call(this, action.Source.View, actionType.CLEAR_MARKS_AND_ANNOTATIONS, success);
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, this.markGroupId.toString()).
            replace(/{success}/g, success.toString());
    }
    Object.defineProperty(ClearMarksAndAnnotationsAction.prototype, "markGroupId", {
        /**
         * returns the markGroupId
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return ClearMarksAndAnnotationsAction;
}(dataRetrievalAction));
module.exports = ClearMarksAndAnnotationsAction;
//# sourceMappingURL=clearmarksandannotationsaction.js.map