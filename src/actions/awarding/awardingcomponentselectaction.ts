import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class AwardingComponentSelectAction extends action {

    private _examProductId: string;
    private _componentId: string;
	private _assessmentCode: string;
	private _viaUserOption: boolean;

	constructor(componentId: string, examproductId: string, assessmentCode: string, viaUserOption: boolean) {
        super(action.Source.View, actionType.AWARDING_COMPONENT_SELECT);
        this._examProductId = examproductId;
        this._componentId = componentId;
		this._assessmentCode = assessmentCode;
		this._viaUserOption = viaUserOption;
    }

    public get examProductId(): string {
        return this._examProductId;
    }

    public get componentId(): string {
        return this._componentId;
    }

    public get assessmentCode(): string {
        return this._assessmentCode;
	}

	public get viaUserOption(): boolean {
        return this._viaUserOption;
	}
}

export = AwardingComponentSelectAction;
