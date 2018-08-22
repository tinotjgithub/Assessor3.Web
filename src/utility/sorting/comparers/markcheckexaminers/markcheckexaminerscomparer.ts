import comparerInterface = require('../../sortbase/comparerinterface');
import stringFormatHelper = require('../../../stringformat/stringformathelper');

/**
 * This is a mark check examiners list comparer class and method
 */
class MarkCheckExaminersComparer  implements comparerInterface {
    /** Comparer to sort the marking target list
     * in ascending order of marking mode id
     */
    public compare(a: MarkingCheckExaminerInfo, b: MarkingCheckExaminerInfo) {
        if (this.getFormattedName(a.toExaminer.initials, a.toExaminer.surname) <
            this.getFormattedName(b.toExaminer.initials, b.toExaminer.surname)) {
            return -1;
        }
        if (this.getFormattedName(a.toExaminer.initials, a.toExaminer.surname) >
            this.getFormattedName(b.toExaminer.initials, b.toExaminer.surname)) {
            return 1;
        }

        return 0;
    }

    /**
     * Get the out put of formatted username
     * @param {initials} initials
     * @param {surname} surname
     * @returns
     */
    private getFormattedName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);

        return formattedString;
    }
}

export = MarkCheckExaminersComparer;