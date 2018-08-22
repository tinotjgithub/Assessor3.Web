import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import adminSupportSortDetails = require('../../components/utility/grid/adminsupportsortdetails');

class AdminSupportSortAction extends action {
	private sortDetails: adminSupportSortDetails;

	/**
	 * sort action constructor
	 * @param sortDetails
	 */
	constructor(sortDetails: adminSupportSortDetails) {
		super(action.Source.View, actionType.ADMIN_SUPPORT_SORT_ACTION);
		this.sortDetails = sortDetails;
		this.auditLog.logContent = this.auditLog.logContent;
	}

	/* return admin support examiner sort details*/
	public get getAdminSupportSortDetails(): adminSupportSortDetails {
		return this.sortDetails;
	}
}
export = AdminSupportSortAction;
