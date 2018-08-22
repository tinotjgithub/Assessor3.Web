import loggerBase = require('../../base/loggerbase');
import auditLoggingCategory = require('./auditloggingcategory');

class AuditLoggingHelper extends loggerBase {

	/**
	 * Constructor
	 */
	constructor() {
        super(auditLoggingCategory.GENERAL);
    }
}

export = AuditLoggingHelper;
