import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class UpdatefilterForCandidateDataSelectAction extends action {

    private _selectedGrade: string;
    private _selectedTotalMark: string;
    private _orderbyGrade: boolean;

    constructor(selectedGrade: string, selectedTotalMark: string, orderbyGrade: boolean) {
        super(action.Source.View, actionType.UPDATE_FILTER_FOR_CANDIDATE_DATA_SELECTECTION);
        this._selectedGrade = selectedGrade;
        this._selectedTotalMark = selectedTotalMark;
        this._orderbyGrade = orderbyGrade;
    }

    public get selectedGrade(): string {
        return this._selectedGrade;
    }

    public get selectedTotalMark(): string {
        return this._selectedTotalMark;
    }

    public get orderByGrade(): boolean {
        return this._orderbyGrade;
    }
}

export = UpdatefilterForCandidateDataSelectAction;