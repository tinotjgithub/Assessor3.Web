import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class AwardingJudgementStatusGetAction extends dataRetrievalAction {
    private _awardingJudgementStatusList: AwardingJudgementStatusList;
    private _examSessionId: number;

    constructor(success: boolean, awardingJudgementStatusList: AwardingJudgementStatusList) {
        super(action.Source.View, actionType.AWARDING_JUDGEMENT_STATUS , success);
        this._awardingJudgementStatusList = awardingJudgementStatusList;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    public get isSuccess(): boolean{
        return this._awardingJudgementStatusList.success;
    }

    public get judgementStatusList(): AwardingJudgementStatusList{
        return this._awardingJudgementStatusList;
    }
}

export = AwardingJudgementStatusGetAction;
