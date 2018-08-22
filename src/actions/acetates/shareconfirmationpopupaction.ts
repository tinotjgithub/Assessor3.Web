import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stringHelper = require('../../utility/generic/stringhelper');
import enums = require('../../components/utility/enums');

class ShareConfirmationPopupAction extends action {
    private _clientToken: string;
    private _isShared: boolean;

    /**
     * Constructor
     * @param clientToken
     * @param isShared
     */
    constructor(clientToken: string, isShared: boolean) {
        super(action.Source.View, actionType.SHARE_CONFIRMATION_POPUP_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, clientToken.toString());
        this._clientToken = clientToken;
        this._isShared = isShared;
    }

    /**
     * Get clientToken of selected acetate
     */
    public get clienToken(): string {
        return this._clientToken;
    }

    /**
     * Get shared status of selected acetate
     */
    public get ShareMultiline(): boolean {
        return this._isShared;
    }
}

export = ShareConfirmationPopupAction;