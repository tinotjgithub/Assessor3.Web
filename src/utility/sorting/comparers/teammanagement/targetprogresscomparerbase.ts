import comparerInterface = require('../../sortbase/comparerinterface');
import enums = require('./../../../../components/utility/enums');

/**
 * base class for target progress comparers
 * @abstract
 * @class TargetProgressComparerBase
 * @implements {comparerInterface}
 */
abstract class TargetProgressComparerBase implements comparerInterface {

    /**
     * compare function which will be defined in derived classess
     * @param a 
     * @param b 
     */
    public abstract compare(a: ExaminerViewDataItem, b: ExaminerViewDataItem) : number;

    /**
     * This will return the role hierarchy for sorting.
     * @protected
     * @memberof TargetProgressComparerBase
     */
    protected roleHierarchy = (examinerRole: enums.ExaminerRole) => {
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
    }

    /**
     * Return progress
     * @protected
     * @memberof TargetProgressComparerBase
     */
    protected getProgress = (examinerProgress: number, examinerTarget: number) : number => {
        // if examiner target is zero then return zero to avoid divide by zero error
        if (examinerTarget === 0) {
            return 0;
        }

        return examinerProgress / examinerTarget;
    }
}

export = TargetProgressComparerBase;