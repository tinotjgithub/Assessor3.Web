"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SortAction = (function (_super) {
    __extends(SortAction, _super);
    /**
     * sort action constructor
     * @param sortDetails
     */
    function SortAction(sortDetails) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SORT_ACTION);
        this.sortDetails = sortDetails;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(SortAction.prototype, "getStandardisationSortDetails", {
        get: function () {
            return this.sortDetails;
        },
        enumerable: true,
        configurable: true
    });
    return SortAction;
}(action));
module.exports = SortAction;
//# sourceMappingURL=sortaction.js.map