"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var EnhancedOffpageCommentDataUpdateAction = (function (_super) {
    __extends(EnhancedOffpageCommentDataUpdateAction, _super);
    /**
     * Constructor
     * @param isAllPagesAnnotated
     * @param treeViewItem
     */
    function EnhancedOffpageCommentDataUpdateAction(index, markGroupId, style, remarkHeaderText) {
        _super.call(this, action.Source.View, actionType.ENHANCED_OFFPAGE_COMMENT_INDEX_UPDATE_ACTION);
        this._index = index;
        this.selectedMarkGroupId = markGroupId;
        this.backgroundColor = style;
        this.headerText = remarkHeaderText;
        this.auditLog.logContent = this.auditLog.logContent.replace('{index}', index.toString());
    }
    Object.defineProperty(EnhancedOffpageCommentDataUpdateAction.prototype, "index", {
        /**
         * Returns a index value of marking type.
         */
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffpageCommentDataUpdateAction.prototype, "markGroupId", {
        /**
         * Returns selected markGroup id.
         */
        get: function () {
            return this.selectedMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffpageCommentDataUpdateAction.prototype, "style", {
        /**
         * returns style based on remarks
         *
         * @readonly
         * @type {React.CSSProperties}
         * @memberof EnhancedOffpageCommentDataUpdateAction
         */
        get: function () {
            return this.backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffpageCommentDataUpdateAction.prototype, "remarkHeaderText", {
        /**
         * returns Header text based on remarks
         */
        get: function () {
            return this.headerText;
        },
        enumerable: true,
        configurable: true
    });
    return EnhancedOffpageCommentDataUpdateAction;
}(action));
module.exports = EnhancedOffpageCommentDataUpdateAction;
//# sourceMappingURL=enhancedoffpagecommentdataupdateaction.js.map