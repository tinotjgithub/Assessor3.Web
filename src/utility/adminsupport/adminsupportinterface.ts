import enums = require('../../components/utility/enums');
import gridRow = require('../../components/utility/grid/gridrow');

/**
 * AdminSupportHelper class
 */
interface AdminSupportInterface {

    /**
     * GenerateTableHeader is used for generating header collection.
     * @param comparerName
     * @param sortDirection
     */
	generateTableHeader(comparerName: string, sortDirection: enums.SortDirection): Immutable.List<gridRow>;

    /**
     * returns the table row collection for table header.
     * @param comparerName
     * @param sortDirection
     */
	getTableHeader(comparerName: string, sortDirection: enums.SortDirection): Immutable.List<gridRow>;

	/**
	 * Generate Centre Row Definition
	 * @param adminSupportExaminerList
	 */
	generateExaminersRowDefinition(adminSupportExaminerList: SupportAdminExaminerList);
}
export = AdminSupportInterface;