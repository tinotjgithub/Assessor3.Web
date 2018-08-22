import comparerInterface = require('../sortbase/comparerinterface');

class PageNumberComparer implements comparerInterface {
    /** Comparer to sort the pages list in ascending order of Page Number */
    public compare(a: ScriptImage, b: ScriptImage) {
        if (a.pageNumber > b.pageNumber) {
            return 1;
        }
        if (a.pageNumber < b.pageNumber) {
            return -1;
        }
        return 0;
    }
}

export = PageNumberComparer;