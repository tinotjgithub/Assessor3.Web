import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for removing response from collection.
 */
class UpdateResponseAction extends action {

    private _worklistType: enums.WorklistType;

    private _markGroupId: number;

    /**
     * Constructor UpdateResponseAction
     */
    constructor(markGroupId: number, worklistType: enums.WorklistType) {
        super(action.Source.View, actionType.REJECT_RIG_REMOVE_RESPONSE_ACTION);
        this._worklistType = worklistType;
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroup_ID}/g, markGroupId.toString());
    }

    /**
     * return mark group id.
     */
    public get markGroupID(): number {
        return this._markGroupId;
    }

    /**
     * return worklist type.
     */
    public get worklistType(): enums.WorklistType {
        return this._worklistType;
    }
}

export = UpdateResponseAction;