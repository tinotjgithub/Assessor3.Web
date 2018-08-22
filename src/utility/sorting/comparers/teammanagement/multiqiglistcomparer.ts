import qigDetails = require('../../../../dataservices/teammanagement/typings/qigdetails');
import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Multi QIG List comparer class and method
 */
class MultiQigListComparer implements comparerInterface {
    /** Comparer to sort the qig list in ascending order of QIG Name */
    public compare(a: qigDetails, b: qigDetails) {
        if (a.qigName > b.qigName) {
            return 1;
        }
        if (a.qigName < b.qigName) {
            return -1;
        }
        return 0;
    }
}

export = MultiQigListComparer;