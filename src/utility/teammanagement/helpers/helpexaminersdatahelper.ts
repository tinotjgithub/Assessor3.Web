import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import enums = require('../../../components/utility/enums');

/**
 * Helper class for help examiner data
 */
class HelpExaminerDataHelper {

    private sepActions: Array<number>;

    /**
     * Get SEP Actions.
     */
    public getSEPActions = (examinerRoleId : number) => {
        if (teamManagementStore && teamManagementStore.instance.examinersForHelpExaminers) {
            this.sepActions = new Array<number>();
            let examinersForHelpExaminers = teamManagementStore.instance.examinersForHelpExaminers.toArray();
            examinersForHelpExaminers.forEach((examiner: ExaminerDataForHelpExaminer) => {
                if (examiner.examinerRoleId === examinerRoleId) {
                    let actions = examiner.actions;
                    actions.forEach((item: number) => {
                        if (item === enums.SEPAction.ProvideSecondStandardisation
                            || item === enums.SEPAction.Approve
                            || item === enums.SEPAction.Re_approve
                            || item === enums.SEPAction.SendMessage) {
                            this.sepActions.push(item);
                        }
                    });
                }
            });
        }

        return this.sepActions;
    }
}

export = HelpExaminerDataHelper;