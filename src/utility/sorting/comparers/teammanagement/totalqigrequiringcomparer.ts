import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This comparer is used for sorting in Help Examiners Grid.
 */
class TotalQIGRequiringComparer implements comparerInterface {
    /**
     * Comparer to sort the help examiners grid in ascending order of action requiring qig count.
     */
    public compare(a: ExaminerDataForHelpExaminer, b: ExaminerDataForHelpExaminer) {
        if (+a.actionRequireQigCount > +b.actionRequireQigCount) {
            return 1;
        }
        if (+a.actionRequireQigCount < +b.actionRequireQigCount) {
            return -1;
        }
        return 0;
    }
}

export = TotalQIGRequiringComparer;