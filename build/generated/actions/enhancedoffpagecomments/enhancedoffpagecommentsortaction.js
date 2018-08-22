"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for enhanced off-page comment sort operation
 * @class EnhancedOffPageCommentSortAction
 * @extends {action}
 */
var EnhancedOffPageCommentSortAction = (function (_super) {
    __extends(EnhancedOffPageCommentSortAction, _super);
    /**
     * Creates an instance of EnhancedOffPageCommentSortAction.
     * @param {EnhancedOffPageCommentSortDetails} sortDetails
     * @memberof EnhancedOffPageCommentSortAction
     */
    function EnhancedOffPageCommentSortAction(sortDetails) {
        _super.call(this, action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENT_SORT_ACTION);
        this._sortDetails = sortDetails;
    }
    Object.defineProperty(EnhancedOffPageCommentSortAction.prototype, "sortDetails", {
        /**
         * Returns sort details
         * @readonly
         * @type {EnhancedOffPageCommentSortDetails}
         * @memberof EnhancedOffPageCommentSortAction
         */
        get: function () {
            return this._sortDetails;
        },
        enumerable: true,
        configurable: true
    });
    return EnhancedOffPageCommentSortAction;
}(action));
module.exports = EnhancedOffPageCommentSortAction;
//# sourceMappingURL=enhancedoffpagecommentsortaction.js.map