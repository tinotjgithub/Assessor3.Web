import comparerInterface = require('../../sortbase/comparerinterface');

class TagComparerDesc implements comparerInterface {

    /** Comparer to sort the work list in Descending order of Tag indicator */
    public compare(a: any, b: any) {
        // "No Tag" with tag id 0 should always display at first
        if (a.tagOrder === 0 && b.tagOrder !== 0) {
            return -1;
        }

        if (a.tagOrder !== 0 && b.tagOrder === 0) {
            return 1;
        }

        if (a.tagOrder !== 0 && b.tagOrder !== 0) {

            if (a.tagOrder > b.tagOrder) {
                return -1;
            }

            if (a.tagOrder < b.tagOrder) {
                return 1;
            }
        }

        if (+a.displayId > +b.displayId) {
            return -1;
        }
        if (+a.displayId < +b.displayId) {
            return 1;
        }
        return 0;
    }
}
export = TagComparerDesc;