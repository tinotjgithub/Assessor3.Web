import loggerBase = require('../../base/loggerbase');
import logCategory = require('../auditlogger/auditloggingcategory');

class TeamManagementLoggingHelper extends loggerBase {

	/**
	 * Constructor
	 */
	constructor() {
		super(logCategory.TEAM_MANAGEMENT_TAB_SWITCH);
	}

	/**
	 * Log response open audit details.
	 * @param reason
	 * @param activity
	 * @param statusData
	 */
	public logSubordinateStatusChange(reason: string,
		activity: string,
		statusData: any): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'statusData': statusData
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, true);
	}

	/**
	 * Log supervisor sampling feedback change actions.
	 * @param reason
	 * @param activity	
	 * @param samplingArg
	 */
	public logSupervisorSamplingChanges(reason: string,
		activity: string,
		samplingArg: any): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'SamplingArg': samplingArg
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, true);
	}
}
export = TeamManagementLoggingHelper;