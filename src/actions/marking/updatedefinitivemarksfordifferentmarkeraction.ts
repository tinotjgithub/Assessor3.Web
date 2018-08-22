import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class UpdateDefinitiveMarksForDifferentMarkerAction extends action {
	private _examinerRoleId: number;
	private _deleteProvisionalMarks: boolean;

	/**
	 * Constructor
	 * @param examinerRoleId
	 * @param deleteProvisionalMarks
	 */
	constructor(examinerRoleId: number, deleteProvisionalMarks: boolean) {
		super(action.Source.View, actionType.UPDATE_DEFINITIVE_MARKS_FOR_DIFFERENT_MARKER);

		this._examinerRoleId = examinerRoleId;
		this._deleteProvisionalMarks = deleteProvisionalMarks;
	}

	public get examinerRoleId(): number {
		return this._examinerRoleId;
	}

	public get deleteProvisionalMarks(): boolean {
		return this._deleteProvisionalMarks;
	}
}

export = UpdateDefinitiveMarksForDifferentMarkerAction;
