import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for clearing marks and annotations data from store
 */
class ClearMarksAndAnnotationsAction extends dataRetrievalAction {

    private _markGroupId: number;

    /**
     * Constructor ClearMarksAndAnnotationsAction
     * @param markGroupId
     * @param success
     */
    constructor(markGroupId: number, success: boolean) {
        super(action.Source.View, actionType.CLEAR_MARKS_AND_ANNOTATIONS, success);
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, this.markGroupId.toString()).
            replace(/{success}/g, success.toString());
    }

   /**
    * returns the markGroupId
    */
    public get markGroupId() {
        return this._markGroupId;
    }

}

export = ClearMarksAndAnnotationsAction;