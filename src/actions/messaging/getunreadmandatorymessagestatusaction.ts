import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class GetUnReadMandatoryMessageStatusAction extends dataRetrievalAction {

    private _isUnreadMandatoryMessagePresent: boolean;
    private _triggerPoint: enums.TriggerPoint;

    /**
     * Constructor
     * @param success
     * @param isUnreadMandatoryMessagePresent
     */
    constructor(success: boolean, isUnreadMandatoryMessagePresent: boolean, triggerPoint: enums.TriggerPoint) {
        super(action.Source.View, actionType.GET_UNREAD_MANDATORY_MESSAGE_STATUS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());

        this._isUnreadMandatoryMessagePresent = isUnreadMandatoryMessagePresent;
        this._triggerPoint = triggerPoint;
    }

    /**
     * Return true if unread mandatory messages present else return false
     */
    public get isUnreadMandatoryMessagePresent(): boolean {
        return this._isUnreadMandatoryMessagePresent;
    }

    /**
     * Returns the triggering point
     */
    public get triggerPoint(): enums.TriggerPoint {
        return this._triggerPoint;
    }
}

export = GetUnReadMandatoryMessageStatusAction;