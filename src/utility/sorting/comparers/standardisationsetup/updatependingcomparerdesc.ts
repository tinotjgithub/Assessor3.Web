import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a update pending comparer class and method.
 */
class UpdatePendingComparerDesc implements comparerInterface {

    /**
     * get element text
     * @param item 
     */
    private getElementText(item: boolean): string {
        return item ? 'Yes' : 'No';
    }

    /**
     * Method to compare update pending column.
     * @param a 
     * @param b 
     */
    public compare(a: any, b: any) {
        let value: number;
        value = comparerhelper.stringSortDesc(
            this.getElementText(a.updatesPending), this.getElementText(b.updatesPending));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = UpdatePendingComparerDesc;