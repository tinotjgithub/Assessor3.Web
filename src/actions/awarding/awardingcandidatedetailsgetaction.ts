import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable= require('immutable');

class AwardingCandidateDetailsGetAction extends dataRetrievalAction {
    private _candidateDetailsList: AwardingCandidateDetailsList;
    private _examSessionId: number;

    constructor(success: boolean, candidateDetailsList: AwardingCandidateDetailsList, examSessionId : number) {
        super(action.Source.View, actionType.CANDIDATE_DETAILS_GET , success);
        this._candidateDetailsList = candidateDetailsList;
        this._examSessionId = examSessionId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    public get isSuccess(): boolean{
        return this._candidateDetailsList.success;
    }

    public get candidateDetailsList(): AwardingCandidateDetailsList{
        return this._candidateDetailsList;
    }

    public get selectedExamSessionId(): number{
        return this._examSessionId;
    }
}

export = AwardingCandidateDetailsGetAction;
