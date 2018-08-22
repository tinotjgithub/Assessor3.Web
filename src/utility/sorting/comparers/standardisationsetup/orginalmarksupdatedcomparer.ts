import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a orginal marks updated comparer class and method.
 */
class OrginalMarksUpdatedComparer implements comparerInterface {

    /**
     * gets column elwmwnt text.
     * @param item 
     */
    private getElementText(item: boolean): string {
        return item ? 'Yes' : 'No';
    }

    /**
     * Compare method for orginal marks updated column
     * @param a 
     * @param b 
     */
    public compare(a: any, b: any) {
        let value: number;
        value = comparerhelper.stringSort(this.getElementText(a.originalMarksUpdated), this.getElementText(b.originalMarksUpdated));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = OrginalMarksUpdatedComparer;