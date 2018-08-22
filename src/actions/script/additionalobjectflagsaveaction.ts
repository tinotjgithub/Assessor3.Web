import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class AdditionalObjectFlagSaveAction extends action {

    private _additionalObjectFlag: Immutable.Map<number, boolean>;

    /**
     * Constructor Additional Object Flag Save Action
     * @param additionalObjectFlag
     * @param displayid
     */
    constructor(additionalObjectFlag: Immutable.Map<number, boolean>, displayid: number) {
        super(action.Source.View, actionType.ADDITIONAL_OBJECT_FLAG_SAVE_ACTION);
        this._additionalObjectFlag = additionalObjectFlag;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{count}/g,
            additionalObjectFlag.count().toString()).replace(/{responseid}/g, displayid.toString());
    }

    /**
     * returns the additional object flag collection.
     */
    public get additionalObjectFlagCollection(): Immutable.Map<number, boolean> {
        return this._additionalObjectFlag;
    }
}
export = AdditionalObjectFlagSaveAction;