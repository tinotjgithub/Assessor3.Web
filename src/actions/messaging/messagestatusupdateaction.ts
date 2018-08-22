import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for message update
 */
class MessageStatusUpdateAction extends dataRetrievalAction {
    private _msgId: number;
    private _msgstatus: enums.MessageReadStatus;

    /**
     * Constructor
     * @param success
     * @param msgId
     * @param messageDistributionIds
     * @param msgReadStatus
     */
    constructor(success: boolean, msgId: number, messageDistributionIds: Immutable.List<number>, msgReadStatus: enums.MessageReadStatus) {
        super(action.Source.View, actionType.MESSAGE_STATUS_UPDATE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', msgId.toString())
            .replace('{1}', enums.getEnumString(enums.MessageReadStatus, msgReadStatus));
        this._msgId = msgId;
        this._msgstatus = msgReadStatus;
    }

    /**
     * Message Id for the update
     */
    public get messagId() {
        return this._msgId;
    }

    /**
     * Message status for the update
     */
    public get messageStatus() {
        return this._msgstatus;
    }

}

export = MessageStatusUpdateAction;

