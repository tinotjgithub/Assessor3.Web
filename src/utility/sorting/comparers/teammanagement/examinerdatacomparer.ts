import stringFormatHelper = require('../../../stringformat/stringformathelper');
import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a examiner data comparer class and method for team management
 */
class ExaminerDataComparer implements comparerInterface {

   /**
    * Comparer to sort the my team list in ascending order of examiner name
    */
    public compare(a: ExaminerData, b: ExaminerData) {

        if (this.getFormattedExaminerName(a.initials, a.surname) > this.getFormattedExaminerName(b.initials, b.surname)) {
            return 1;
        }
        if (this.getFormattedExaminerName(a.initials, a.surname) < this.getFormattedExaminerName(b.initials, b.surname)) {
            return -1;
        }
        return 0;
    }

   /**
    * Returns the formatted examiner name
    * @param initials
    * @param surname
    */
    private getFormattedExaminerName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    }
}

export = ExaminerDataComparer;