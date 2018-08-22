import gaHelper = require('../../utility/googleanalytics/gahelper');
import aiHelper = require('../../utility/applicationinsightanalytics/aihelper');
declare let config: any;

class LoggerBase {

	// Formatted input result
	private formatterString: string = '';

	// The log action type
    private readonly actionType: string;

    // The log helper
    public logHelper: any;

	/**
	 * Constructor
	 * @param type
	 */
	constructor(actionType: string) {
        this.actionType = actionType;
        if (config.logger.LOGGER_TYPE.toLowerCase() === 'ga') {
            this.logHelper = gaHelper;
        } else {
            this.logHelper = aiHelper;
        }
	}

	/**
	 * Format the input
	 * @param args
	 */
	protected formatInputAction(...args: any[]): string {

		try {
			// Clearing previous log details.
			this.formatterString = '';
			this.format(args);

		} catch (e) {
			// Handle the exception
		}
		return this.formatterString;
	}

	/**
	 * Format and map the data
	 * @param args
	 */
	private format(...args: any[]): void {
		for (var i = 0; i < args.length; i++) {
			this.mapObject(args[i]);
		}
	}

	/**
	 * Map the logging data
	 * @param obj
	 */
	private mapObject(obj: any): void {

		if (obj === undefined || obj === null) {
			return;
		}

		if (Array.isArray(obj)) {
			for (var j = 0; j < obj.length; j++) {
				this.mapObject(obj[j]);
			}
		} else if (typeof obj !== 'object') {
			this.addSpacer(obj);
		} else if (obj['@@__IMMUTABLE_LIST__@@'] === true ||
			obj['@@__IMMUTABLE_MAP__@@'] === true ||
			obj['@@__IMMUTABLE_ARRAY__@@'] === true) {

			this.mapObject(obj.toArray());
		} else {
			for (var key in obj) {
				if (typeof obj[key] === 'object') {
					this.mapObject(obj[key]);
				} else {
					this.addSpacer(key + ' : ' + obj[key]);
				}
			}
		}
	}

	/**
	 * Add space and delimiter to the string
	 * @param val
	 */
	private addSpacer(val: string) {

		if (this.formatterString === '') {
			this.formatterString = val;
		} else {
			this.formatterString = this.formatterString + ' , ' + val;
		}
	}

	/**
	 * Save action
	 * @param action
	 * @param saveAction
	 */
    protected saveAuditLog(action: string, saveAction: boolean): void {
        this.logHelper.sendLogToServer(this.actionType, action, saveAction);
	}

	/**
	 * Send actions logs to analytics.
	 * @param actionType
	 * @param actions
	 */
	private sendLogToServer(actionType: string, actions: Array<string>): void {
		// Process only the actions belongs to the current type.
		if (actionType === this.actionType) {

			let result: string = '';
			actions.map((x: string) => {
				result += x + '\n';
			});
		}
    }
}
export = LoggerBase;