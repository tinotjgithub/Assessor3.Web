import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');

/**
 * Class for Rotate Response Action
 */
class RotateAction extends action {

    private _rotationType: enums.ResponseViewSettings;

    /**
     * Constructor RotateAction
     * @param responseViewSettings
     * @param actionType
     */
    constructor(responseViewSettings: enums.ResponseViewSettings, actionType: string) {
        super(action.Source.View, actionType);
        this.auditLog.logContent = this.auditLog.logContent.replace('{direction}', enums.ResponseViewSettings[responseViewSettings]);
        this._rotationType = responseViewSettings;
    }

    /**
     * This method will return the Rotate Type
     */
    public get rotationType(): enums.ResponseViewSettings {
        return this._rotationType;
    }
}

export = RotateAction;