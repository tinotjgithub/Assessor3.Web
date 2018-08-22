import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class SetSelectedCandidateDataAction extends action {

    private _awardingCandidateId: number;

    constructor(awardingCandidateId: number) {
        super(action.Source.View, actionType.SET_SELECTED_CANDIDATE_DATA);
        this._awardingCandidateId = awardingCandidateId;
    }

    public get awardingCandidateId(): number {
        return this._awardingCandidateId;
    }
}

export = SetSelectedCandidateDataAction;
