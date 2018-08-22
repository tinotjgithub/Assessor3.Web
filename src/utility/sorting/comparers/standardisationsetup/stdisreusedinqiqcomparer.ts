import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a update pending comparer class and method.
 */
class StdIsReUsedInQigComparer implements comparerInterface {

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
        value = comparerhelper.stringSort(
            this.getElementText(a.reUsedQIG), this.getElementText(b.reUsedQIG));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = StdIsReUsedInQigComparer;