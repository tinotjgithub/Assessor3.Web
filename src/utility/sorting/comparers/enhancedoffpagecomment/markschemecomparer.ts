import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Item comparer class and method
 */
interface Item {
    id: number;
    sequenceNo: number;
    name: string;
}

class MarkSchemeComparer implements comparerInterface {
    /** Comparer to sort items in ascending order of Mark Scheme names */
    public compare(a: Item, b: Item) {
        if (a.sequenceNo > b.sequenceNo) {
            return 1;
        }
        if (a.sequenceNo < b.sequenceNo) {
            return -1;
        }

        return 0;
    }
}

export = MarkSchemeComparer;