import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
/**
 * The Action class for Retrieving examiner marks.
 */
class RetrieveMarksAction extends dataRetrievalAction {

    private _examinerMarkDetails: examinerMarkData;

    // is the action is success or not
    private _isSuccess: boolean;

    // selected mark group id for the call
    private _markGroupId: number;

    private _hasComplexOptionality: boolean;

    /**
     * Initializing a new instance of Retrieve marks action.
     * @param {boolean} success
     */
    constructor(data: examinerMarkData, success: boolean, markGroupId: number, hasComplexOptionality: boolean) {
        super(action.Source.View, actionType.RETRIEVE_MARKS, success);
        this._examinerMarkDetails = data;
        this._isSuccess = success;
        this._markGroupId = markGroupId;
        this._hasComplexOptionality = hasComplexOptionality;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    public get examinerMarkDetails(): examinerMarkData {
        return this._examinerMarkDetails;
    }

    /**
     * returns if the action is success or not
     */
    public get isSuccess(): boolean {
        return this._isSuccess;
    }

    /**
     * selected mark group id
     */
    public get markGroupId(): number {
        return this._markGroupId;
    }

    /**
     * returns hasComplexOptionality
     */
    public get hasComplexOptionality(): boolean {
        return this._hasComplexOptionality;
    }
}
export = RetrieveMarksAction;