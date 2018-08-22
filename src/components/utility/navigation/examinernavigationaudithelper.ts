import loggerBase = require('../../base/loggerbase');
import logCategory = require('../auditlogger/auditloggingcategory');

class ExaminerNavigationAuditHelper extends loggerBase {

	/**
	 * Constructor
	 */
	constructor() {
		super(logCategory.SCREEN_NAVIGATION);
	}

	/**
	 * Log response open audit details.
	 * @param reason
	 * @param activity
	 * @param displayId
	 * @param responseMode
	 */
	public logResponseOpenAudit(reason: string,
		activity: string,
		displayId: string,
		responseMode: string): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'displayId': displayId,
			'responseMode': responseMode
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, true);
	}
}
export = ExaminerNavigationAuditHelper;