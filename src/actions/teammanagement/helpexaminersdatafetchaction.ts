import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');

/**
 * Action class for retrieving Examiner Data For help Examiner
 */
class HelpExaminersDataFetchAction extends dataRetrievalAction {

    private examinersDataForhelpExaminer: Immutable.List<ExaminerDataForHelpExaminer>;
    private _isFromHistory: boolean;

    /**
     * constructor
     * @param success
     * @param myTeamData
     * @param isFromHistory
     */
    constructor(success: boolean, myTeamDataList: Immutable.List<ExaminerDataForHelpExaminer>, isFromHistory: boolean) {
        super(action.Source.View, actionType.HELP_EXAMINERS_DATA_FETCH_ACTION, success);
        this.examinersDataForhelpExaminer = myTeamDataList;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Returns help Examiners Data
     */
    public get helpExaminersData(): Immutable.List<ExaminerDataForHelpExaminer> {
        return Immutable.List<ExaminerDataForHelpExaminer>(this.examinersDataForhelpExaminer);
    }

    /**
     * Returns true if it is from recent history
     */
    public get isFromHistory(): boolean {
        return this._isFromHistory;
    }
}

export = HelpExaminersDataFetchAction;
