import enums = require('../enums');
import comparerlist = require('../../../utility/sorting/sortbase/comparerlist');

/**
 * Response sort detail
 */
interface ResponseSortDetails {
    worklistType: enums.WorklistType;
    responseMode: enums.ResponseMode;
    qig: number;
    comparerName: comparerlist;
    sortDirection: enums.SortDirection;
    remarkRequestType?: enums.RemarkRequestType;
}

export = ResponseSortDetails;