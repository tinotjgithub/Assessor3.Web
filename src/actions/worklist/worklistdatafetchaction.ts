import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');

class WorklistDataFetchAction extends dataRetrievalAction {

    private progressData: markerProgressData;

    /**
     * Constructor WorklistDataFetchAction
     * @param success
     * @param json
     */
    constructor(success: boolean, json?: markerProgressData) {
        super(action.Source.View, actionType.WORKLIST_DATA_GET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.progressData = json as markerProgressData;
    }

    /**
     * Returns the examiner progress data
     */
    public getExaminerProgressData() {
        return this.progressData;
    }
}

export = WorklistDataFetchAction;