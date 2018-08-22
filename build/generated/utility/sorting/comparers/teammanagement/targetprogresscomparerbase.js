"use strict";
var enums = require('./../../../../components/utility/enums');
/**
 * base class for target progress comparers
 * @abstract
 * @class TargetProgressComparerBase
 * @implements {comparerInterface}
 */
var TargetProgressComparerBase = (function () {
    function TargetProgressComparerBase() {
        /**
         * This will return the role hierarchy for sorting.
         * @protected
         * @memberof TargetProgressComparerBase
         */
        this.roleHierarchy = function (examinerRole) {
            switch (examinerRole) {
                case enums.ExaminerRole.principalExaminer:
                    return 1;
                case enums.ExaminerRole.assistantPrincipalExaminer:
                    return 2;
                case enums.ExaminerRole.autoApprovedSeniorTeamLeader:
                    return 3;
                case enums.ExaminerRole.seniorTeamLeader:
                    return 4;
                case enums.ExaminerRole.teamLeader:
                    return 5;
                case enums.ExaminerRole.assistantExaminer:
                    return 6;
                default:
                    return 100;
            }
        };
        /**
         * Return progress
         * @protected
         * @memberof TargetProgressComparerBase
         */
        this.getProgress = function (examinerProgress, examinerTarget) {
            // if examiner target is zero then return zero to avoid divide by zero error
            if (examinerTarget === 0) {
                return 0;
            }
            return examinerProgress / examinerTarget;
        };
    }
    return TargetProgressComparerBase;
}());
module.exports = TargetProgressComparerBase;
//# sourceMappingURL=targetprogresscomparerbase.js.map