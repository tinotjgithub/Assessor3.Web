import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stringHelper = require('../../utility/generic/stringhelper');
import enums = require('../../components/utility/enums');

class ShareAcetateDataAction extends action {
    private _clientToken: string;

    /**
     * Constructor
     * @param clientToken
     */
    constructor(clientToken: string) {
        super(action.Source.View, actionType.SHARE_ACETATE_DATA_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, clientToken.toString());
        this._clientToken = clientToken;
    }

    /**
     * Get clientToken of selected acetate
     */
    public get clienToken(): string {
        return this._clientToken;
    }
}

export = ShareAcetateDataAction;