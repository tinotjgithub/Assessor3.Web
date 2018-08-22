import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Mark comparer class and method
 */
class MarkComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of Mark */
    public compare(a: any, b: any) {
        let value: number;
       /* In case of complex optionality component, the total mark value will be set to null based on the marking progress value.
         * in case of the response in not marking started state, the updated date will be null.
         * Above to condition will result setting totalMarkValue to -1 which will result in inproper sorting.
         * Hence -2 is introduced to reprecent responses in not marking started state. */
        value = comparerhelper.integerSortDesc(
            ((a.updatedDate === null) ? -2 : ((a.totalMarkValue === null) ? -1 : a.totalMarkValue)),
            ((b.updatedDate === null) ? -2 : ((b.totalMarkValue === null) ? -1 : b.totalMarkValue)));

        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    }
}

export = MarkComparerDesc;