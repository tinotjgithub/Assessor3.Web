import enums = require('../enums');
import comparerlist = require('../../../utility/sorting/sortbase/comparerlist');

/**
 * AdminSupport sort detail
 */
interface AdminSupportSortDetails {
	comparerName: comparerlist;
	sortDirection: enums.SortDirection;
}

export = AdminSupportSortDetails;