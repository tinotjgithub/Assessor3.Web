"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateSeenAnnotationAction = (function (_super) {
    __extends(UpdateSeenAnnotationAction, _super);
    /**
     * Constructor
     * @param isAllPagesAnnotated
     * @param treeViewItem
     */
    function UpdateSeenAnnotationAction(isAllPagesAnnotated, treeViewItem) {
        _super.call(this, action.Source.View, actionType.UPDATE_SEEN_ANNOTATION);
        this._isAllPagesAnnotated = isAllPagesAnnotated;
        this._treeViewItem = treeViewItem;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isAllPagesAnnotated}/g, isAllPagesAnnotated.toString());
    }
    Object.defineProperty(UpdateSeenAnnotationAction.prototype, "isAllPagesAnnotated", {
        /**
         * Check if all pages of the response are annotated.
         */
        get: function () {
            return this._isAllPagesAnnotated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateSeenAnnotationAction.prototype, "getTreeViewItem", {
        /*
         * get tree view item
         */
        get: function () {
            return this._treeViewItem;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateSeenAnnotationAction;
}(action));
module.exports = UpdateSeenAnnotationAction;
//# sourceMappingURL=updateseenannotationaction.js.map