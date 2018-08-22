import enums = require('../enums');
import comparerlist = require('../../../utility/sorting/sortbase/comparerlist');

/**
 * StandardisationSetup sort detail
 */
interface StandardisationSortDetails {
	qig: number;
    selectedWorkList: enums.StandardisationSetup;
    comparerName: comparerlist;
	sortDirection: enums.SortDirection;
	centreOrScriptOrReuse?: string;
}

export = StandardisationSortDetails;