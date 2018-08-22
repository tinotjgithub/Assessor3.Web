import comparerInterface = require('../../sortbase/comparerinterface');
import enums = require('./../../../../components/utility/enums');
import targetProgressComparerBase = require('./targetprogresscomparerbase');

/**
 * This is the Target Progress comparer class and method for My Team
 */
class TargetProgressComparerDesc extends targetProgressComparerBase {

    /**
     * This method will sort based on target progress column
     * @param a : ExaminerData
     * @param b : ExaminerData
     */
    public compare(a: ExaminerViewDataItem, b: ExaminerViewDataItem) {
        if (a.markingModeId < b.markingModeId) {
            return 1;
        } else if (a.markingModeId > b.markingModeId) {
            return -1;
        } else if (this.getProgress(a.examinerProgress, a.examinerTarget) < this.getProgress(b.examinerProgress, b.examinerTarget)) {
            return 1;
        } else if (this.getProgress(a.examinerProgress, a.examinerTarget) > this.getProgress(b.examinerProgress, b.examinerTarget)) {
            return -1;
        } else if (a.examinerLevel < b.examinerLevel) {
            // if examiner progress is equal then check examiner level.
            return 1;
        } else if (a.examinerLevel > b.examinerLevel) {
            return -1;
        } else if (this.roleHierarchy(a.examinerRoleId) < this.roleHierarchy(b.examinerRoleId)) {
            // Again if examiner progress is equal then check with role hierarchy.
            return 1;
        } else if (this.roleHierarchy(a.examinerRoleId) > this.roleHierarchy(b.examinerRoleId)) {
            return -1;
        } else {
            return 0;
        }
    }
}

export = TargetProgressComparerDesc;