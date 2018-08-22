import comparerList = require('../sortbase/comparerlist');
import enums = require('../../../components/utility/enums');
interface DefaultSort {
    compareName: comparerList;
    sortDirection: enums.SortDirection;
}
export = DefaultSort;