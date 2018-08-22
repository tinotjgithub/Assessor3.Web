import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class SendMessageAction extends dataRetrievalAction {

    private _examinerRoleId: number;
    private _messagePriority: number;
    private _examBodyTypeId: enums.SystemMessage;
    private _failureCode: enums.FailureCode;
    private _shouldClearMessageDetails: boolean;
    private _messageSendErrorCode: number;

    /**
     * Constructor
     * @param success
     */
    constructor(success: boolean,
        examinerRoleId: number,
        messagePriority: number,
        examBodyTypeId: enums.SystemMessage,
        failureCode: enums.FailureCode,
        shouldClearMessageDetails: boolean,
        messageSendErrorCode: number) {
        super(action.Source.View, actionType.SEND_MESSAGE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._examinerRoleId = examinerRoleId;
        this._messagePriority = messagePriority;
        this._examBodyTypeId = examBodyTypeId;
        this._failureCode = failureCode;
        this._shouldClearMessageDetails = shouldClearMessageDetails;
        this._messageSendErrorCode = messageSendErrorCode;
    }

    /**
     * get examiner roleid in selected qig
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

    /**
     * get examiner message priority
     */
    public get messagePriority(): number {
        return this._messagePriority;
    }

    /**
     * get examiner exam body type id
     */
    public get examBodyTypeId(): enums.SystemMessage {
        return this._examBodyTypeId;
    }

    /**
     * get the failure code on Message Sending
     */
    public get failureCode(): enums.FailureCode {
        return this._failureCode;
    }

    /**
     * indicates should clear the message details
     * @readonly
     * @type {boolean}
     */
    public get shouldClearMessageDetails(): boolean {
        return this._shouldClearMessageDetails;
    }

    /**
     * Error code on message sending failed scenarios
     */
    public get messageSendErrorCode(): number {
        return this._messageSendErrorCode;
    }
}

export = SendMessageAction;