import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class GetSupportAdminExaminerListsAction extends action {

	private _supportAdminExaminerList: SupportAdminExaminerList;

	/**
	 * Constructor
	 * @param success
	 * @param json
	 */
	constructor(success: boolean, json?: SupportAdminExaminerList) {
		super(action.Source.View, actionType.GET_SUPPORT_ADMIN_EXAMINER_LISTS);
		this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());

		this._supportAdminExaminerList = json;
	}

	/**
	 * returns the Support Admin Examiner List
	 */
	public get SupportAdminExaminerList(): SupportAdminExaminerList {
		return this._supportAdminExaminerList;
	}
}
export = GetSupportAdminExaminerListsAction;