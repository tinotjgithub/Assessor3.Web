import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');

class SamplingStatusChangeAction extends dataRetrievalAction {

    private _supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn;
    private _displayId: number;
    /**
     * Constructor SamplingStatusChangeAction
     * @param success
     * @param supervisorSamplingCommentReturn
     */
    constructor(success: boolean,
        supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn, displayId: number) {
        super(action.Source.View, actionType.SAMPLING_STATUS_CHANGE_ACTION, success);
        this._supervisorSamplingCommentReturn = supervisorSamplingCommentReturn;
        this._displayId = displayId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * This method will returns supervisor sampling Comment Return details
     */
    public get supervisorSamplingCommentReturn(): SupervisorSamplingCommentReturn {
        return this._supervisorSamplingCommentReturn;
    }

    /**
     * This method will returns displayId
     */
    public get displayId(): number {
        return this._displayId;
    }
}

export = SamplingStatusChangeAction;
