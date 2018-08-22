"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var WorklistSeedFilterAction = (function (_super) {
    __extends(WorklistSeedFilterAction, _super);
    /**
     * Constroctor for the Worklist Seed Filter Action
     * @param selectedExaminerRoleId
     * @param selectedFilter
     */
    function WorklistSeedFilterAction(selectedExaminerRoleId, selectedFilter) {
        _super.call(this, action.Source.View, actionType.WORKLIST_FILTER_SELECTED);
        this._examinerRoleId = 0;
        this._selectedFilter = selectedFilter;
        this._examinerRoleId = selectedExaminerRoleId;
    }
    Object.defineProperty(WorklistSeedFilterAction.prototype, "getSelectedFilter", {
        /**
         * Get the selected Filter
         */
        get: function () {
            return this._selectedFilter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistSeedFilterAction.prototype, "getExaminerRoleId", {
        /**
         * Get the examiner Role Id
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return WorklistSeedFilterAction;
}(action));
module.exports = WorklistSeedFilterAction;
//# sourceMappingURL=worklistseedfilteraction.js.map