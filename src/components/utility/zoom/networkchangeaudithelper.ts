import loggerBase = require('../../base/loggerbase');
import logCategory = require('../auditlogger/auditloggingcategory');

class NetworkChangeAuditHelper extends loggerBase {

	/**
	 * Constructor
	 */
	constructor() {
		super(logCategory.APPLICATION_OFFLINE);
	}

	/**
	 * Log network change details.
	 * @param reason
	 * @param activity
	 * @param isOnline
	 */
	public logNetworkChangeAudit(reason: string,
		activity: string,
		isOnline: boolean): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'isOnline': isOnline ? 'Online' : 'Offline'
		};

		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, false);
	}
}
export = NetworkChangeAuditHelper;