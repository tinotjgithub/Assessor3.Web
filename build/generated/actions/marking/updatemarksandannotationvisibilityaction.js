"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateMarksAndAnnotationVisibilityAction = (function (_super) {
    __extends(UpdateMarksAndAnnotationVisibilityAction, _super);
    /**
     * Constructor
     * @param UpdateMarksAndAnnotationVisibility
     */
    function UpdateMarksAndAnnotationVisibilityAction(_index, _marksAndAnnotationVisibilityDetails, isEnchancedOffpageCommentVisible, currentEnhancedCommentIndex) {
        _super.call(this, action.Source.View, actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION);
        this.marksAndAnnotationVisibilityDetails = _marksAndAnnotationVisibilityDetails;
        this.index = _index;
        this.currentEnhancedCommentIndex = currentEnhancedCommentIndex;
        this._isEnhancedoffpageCommentVisible = isEnchancedOffpageCommentVisible;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(UpdateMarksAndAnnotationVisibilityAction.prototype, "getMarksAndAnnotationVisibilityDetails", {
        /**
         * returns marks and annotations visibility details
         */
        get: function () {
            return this.marksAndAnnotationVisibilityDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateMarksAndAnnotationVisibilityAction.prototype, "getIndex", {
        /**
         * returns marks and annotations visibility details
         */
        get: function () {
            return this.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateMarksAndAnnotationVisibilityAction.prototype, "getCurrentCommentIndex", {
        /**
         * Returns current selected comment index.
         * @readonly
         * @memberof UpdateMarksAndAnnotationVisibilityAction
         */
        get: function () {
            return this.currentEnhancedCommentIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateMarksAndAnnotationVisibilityAction.prototype, "isEnchancedOffpageCommentVisible", {
        /**
         * Gets whether enhanced offpage comment enabled or not.
         * @readonly
         * @memberof UpdateMarksAndAnnotationVisibilityAction
         */
        get: function () {
            return this._isEnhancedoffpageCommentVisible;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateMarksAndAnnotationVisibilityAction;
}(action));
module.exports = UpdateMarksAndAnnotationVisibilityAction;
//# sourceMappingURL=updatemarksandannotationvisibilityaction.js.map