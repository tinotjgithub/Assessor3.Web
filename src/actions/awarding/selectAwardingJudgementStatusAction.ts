import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class SelectAwardingJudgementStatusAction extends dataRetrievalAction {

    private _awardingJudgementStatus: AwardingJudgementStatus;
    private _totalJudgementCount: number;

    constructor(success: boolean, awardingJudgementStatus: AwardingJudgementStatus, totalJudgementCount: number) {
        super(action.Source.View, actionType.SELECT_AWARDING_JUDGEMENT_STATUS, success);
        this._awardingJudgementStatus = awardingJudgementStatus;
        this._totalJudgementCount = totalJudgementCount;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    public get selectedJudgementStatus(): AwardingJudgementStatus {
        return this._awardingJudgementStatus;
    }

    public get totalJudgmementCount(): number {
        return this._totalJudgementCount;
    }
}

export = SelectAwardingJudgementStatusAction;
