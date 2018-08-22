import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class CopyMarksForDefinitiveAction extends action {
	private _copyMarks: boolean;
	private _isDefinitive: boolean;
	private _avoidEventEmit: boolean;

	/**
	 * Constructor
	 * @param copyMarks
	 * @param isDefinitive
	 */
	constructor(copyMarks: boolean, isDefinitive: boolean, avoidEventEmit: boolean) {
		super(action.Source.View, actionType.COPY_MARKS_FOR_DEFINITIVE);

		this._copyMarks = copyMarks;
		this._isDefinitive = isDefinitive;
		this._avoidEventEmit = avoidEventEmit;
	}

	/**
	 * returns true if marks need to be copied
	 */
	public get copyMarks(): boolean {
	  return this._copyMarks;
	}

	/**
	 * returns whether definitive or not
	 */
	public get isDefinitive(): boolean {
		return this._isDefinitive;
	}

	/**
	 * returns true for avoiding event emit
	 */
	public get avoidEventEmit(): boolean {
		return this._avoidEventEmit;
	}
}

export = CopyMarksForDefinitiveAction;
