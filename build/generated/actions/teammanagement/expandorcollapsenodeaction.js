"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for expand or collapase examiner node
 */
var ExpandOrCollapseNodeAction = (function (_super) {
    __extends(ExpandOrCollapseNodeAction, _super);
    /**
     * constructor
     * @param examinerRoleId
     * @param isExpanded
     */
    function ExpandOrCollapseNodeAction(examinerRoleId, isExpanded) {
        _super.call(this, action.Source.View, actionType.EXPAND_OR_COLLAPSE_NODE);
        this._examinerRoleId = examinerRoleId;
        this._isExpanded = isExpanded;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{examinerRoleId}/g, examinerRoleId.toString()).
            replace(/{isExpanded}/g, isExpanded.toString());
    }
    Object.defineProperty(ExpandOrCollapseNodeAction.prototype, "examinerRoleId", {
        /**
         *  Return the examiner roleId
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpandOrCollapseNodeAction.prototype, "isExpanded", {
        /**
         * Return true while expanding a node
         * Return false while closing a node
         */
        get: function () {
            return this._isExpanded;
        },
        enumerable: true,
        configurable: true
    });
    return ExpandOrCollapseNodeAction;
}(action));
module.exports = ExpandOrCollapseNodeAction;
//# sourceMappingURL=expandorcollapsenodeaction.js.map