import loggerBase = require('../../base/loggerbase');
import logCategory = require('../auditlogger/auditloggingcategory');

class ResponseScreenAuditLoggingHelper extends loggerBase {

	/**
	 * Constructor
	 */
	constructor() {
		super(logCategory.RESPONSE_SCREEN);
	}

	/**
	 * Log response reject audit details.
	 * @param reason
	 * @param activity
	 * @param displayId
	 */
	public logResponseRejectAction(reason: string,
		activity: string,
		displayId: any): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'displayId': displayId
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, true);
	}

	/**
	 * Log response promot to seed audit details.
	 * @param reason
	 * @param activity
	 * @param displayId
	 */
	public logResponsePromotToSeedAction(reason: string,
		activity: string,
		displayId: any): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'displayId': displayId
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, true);
	}

	/**
	 * Log response remark craetion audit
	 * @param reason
	 * @param activity
	 * @param displayId
	 */
	public logSupervisorRemarkCreationAction(reason: string,
		activity: string,
		isRemarkCreatingNow: boolean,
		requestArgument: any): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'isRemarkCreatingNow': isRemarkCreatingNow,
			'requestArgument': requestArgument
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, true);
	}
}
export = ResponseScreenAuditLoggingHelper;