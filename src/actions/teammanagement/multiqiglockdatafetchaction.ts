import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');

/**
 * Action class for retrieving Multi Qig Lock Data.
 */
class MultiQigLockDataFetchAction extends dataRetrievalAction {

    private _examinersDataForhelpExaminer: Immutable.List<MultiQigLockExaminer>;
    private _selectedExaminerId: number;
    private _selectedQigId: number;
    private _selectedExaminerRoleId: number;

    constructor(success: boolean, helpExaminerDataList: Immutable.List<MultiQigLockExaminer>,
        selectedExaminerId: number, selectedQigId: number, selectedExaminerRoleId: number) {
        super(action.Source.View, actionType.MULTI_QIG_LOCK_DATA_FETCH_ACTION, success);
        this._examinersDataForhelpExaminer = helpExaminerDataList;
        this._selectedExaminerId = selectedExaminerId;
        this._selectedQigId = selectedQigId;
        this._selectedExaminerRoleId = selectedExaminerRoleId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Returns Multi qig lock data
     */
    public get MultiQigLockData(): Immutable.List<MultiQigLockExaminer> {
        return Immutable.List<MultiQigLockExaminer>(this._examinersDataForhelpExaminer);
    }

    /**
     * Return selected examiner id
     */
    public get selectedExaminerId(): number {
        return this._selectedExaminerId;
    }

    /**
     * Return selected qig id
     */
    public get selectedQigId(): number {
        return this._selectedQigId;
    }

    /**
     * Return selected examiner role id
     */
    public get selectedExaminerRoleId(): number {
        return this._selectedExaminerRoleId;
    }
}

export = MultiQigLockDataFetchAction;
