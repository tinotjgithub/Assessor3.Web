import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Menu History comparer class and method
 */
class MenuHistoryComparer implements comparerInterface {
    /**
     * Comparer to sort menu history
     */
    public compare(a: any, b: any) {
        if (a.timeStamp > b.timeStamp) {
            return -1;
        }
        if (a.timeStamp < b.timeStamp) {
            return 1;
        }

        return 0;
    }
}

export = MenuHistoryComparer;