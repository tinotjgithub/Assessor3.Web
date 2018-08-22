"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var targetProgressComparerBase = require('./targetprogresscomparerbase');
/**
 * This is the Target Progress comparer class and method for My Team
 */
var TargetProgressComparerDesc = (function (_super) {
    __extends(TargetProgressComparerDesc, _super);
    function TargetProgressComparerDesc() {
        _super.apply(this, arguments);
    }
    /**
     * This method will sort based on target progress column
     * @param a : ExaminerData
     * @param b : ExaminerData
     */
    TargetProgressComparerDesc.prototype.compare = function (a, b) {
        if (a.markingModeId < b.markingModeId) {
            return 1;
        }
        else if (a.markingModeId > b.markingModeId) {
            return -1;
        }
        else if (this.getProgress(a.examinerProgress, a.examinerTarget) < this.getProgress(b.examinerProgress, b.examinerTarget)) {
            return 1;
        }
        else if (this.getProgress(a.examinerProgress, a.examinerTarget) > this.getProgress(b.examinerProgress, b.examinerTarget)) {
            return -1;
        }
        else if (a.examinerLevel < b.examinerLevel) {
            // if examiner progress is equal then check examiner level.
            return 1;
        }
        else if (a.examinerLevel > b.examinerLevel) {
            return -1;
        }
        else if (this.roleHierarchy(a.examinerRoleId) < this.roleHierarchy(b.examinerRoleId)) {
            // Again if examiner progress is equal then check with role hierarchy.
            return 1;
        }
        else if (this.roleHierarchy(a.examinerRoleId) > this.roleHierarchy(b.examinerRoleId)) {
            return -1;
        }
        else {
            return 0;
        }
    };
    return TargetProgressComparerDesc;
}(targetProgressComparerBase));
module.exports = TargetProgressComparerDesc;
//# sourceMappingURL=targetprogresscomparerdesc.js.map