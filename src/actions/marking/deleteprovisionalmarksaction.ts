import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class DeleteProvisionalMarksAction extends action {
	/**
	 * Constructor
	 */
	constructor() {
		super(action.Source.View, actionType.DELETE_PROVISIONAL_MARKS);
	}
}

export = DeleteProvisionalMarksAction;