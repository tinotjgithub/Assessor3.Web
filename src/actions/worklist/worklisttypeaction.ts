import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action when live worklist is selected
 */
class WorklistTypeAction extends dataRetrievalAction {
    private worklistType: enums.WorklistType;
    private responseMode: enums.ResponseMode;
    private remarkRequestType: enums.RemarkRequestType;
    private worklistDetails: WorklistBase;
    private isDirectedRemark: boolean;
    private markSchemeGroupId: number;
    private questionPaperId: number;
    private selectedExaminerRoleId: number;
    private hasComplexOptionality: boolean;

    /**
     * worklist type constructor
     * @param markingmode
     * @param responseMode
     * @param success
     * @param isCached
     * @param responseData
     * @param json
     */
    constructor(worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode,
        remarkRequestType: enums.RemarkRequestType,
        isDirectedRemark: boolean,
        success: boolean,
        isCached: boolean,
        responseData: WorklistBase,
        markSchemeGroupId: number,
        questionPaperId: number,
        selectedExaminerRoleId: number,
        hasComplexOptionality: boolean) {
        super(action.Source.View, actionType.WORKLIST_MARKING_MODE_CHANGE, success);
        this.worklistType = worklistType;
        this.responseMode = responseMode;
        this.remarkRequestType = remarkRequestType;
        this.worklistDetails = responseData;
        this.isDirectedRemark = isDirectedRemark;
        this.markSchemeGroupId = markSchemeGroupId;
        this.questionPaperId = questionPaperId;
        this.selectedExaminerRoleId = selectedExaminerRoleId;
        this.hasComplexOptionality = hasComplexOptionality;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{worklisttype}/g, worklistType.toString());
    }

    /**
     * Gets the marking mode
     */
    get getWorklistType() {
        return this.worklistType;
    }

    /**
     * Gets the response mode
     */
    get getResponseMode(): enums.ResponseMode {
        return this.responseMode;
    }

    /**
     * Gets the remark request type
     */
    get getRemarkRequestType() {
        return this.remarkRequestType;
    }

    /**
     * Gets the worklist details
     */
    get getWorklistData(): WorklistBase {
        return this.worklistDetails;
    }

    /**
     * Gets is directed remark
     */
    get getIsDirectedRemark(): boolean {
        return this.isDirectedRemark;
    }

    /**
     * Gets the mark scheme group Id
     */
    get getMarkSchemeGroupId(): number {
        return this.markSchemeGroupId;
    }

    /**
     * Gets the question paper id
     */
    get getQuestionPaperId(): number {
        return this.questionPaperId;
    }

    /**
     * Gets the selected examiner role id
     */
    get getselectedExaminerRoleId(): number {
        return this.selectedExaminerRoleId;
    }

    /**
     * Gets the complex optionality cc value
     */
    get gethasComplexOptionality(): boolean {
        return this.hasComplexOptionality;
    }
}

export = WorklistTypeAction;