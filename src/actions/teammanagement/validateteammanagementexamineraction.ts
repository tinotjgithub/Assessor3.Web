import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The class for validating examiner from team management.
 */
class ValidateTeamManagementExaminerAction extends dataRetrievalAction {

    private _failureCode: enums.FailureCode;
    private _markSchemeGroupId: number;
    private _isFromRememberQig: boolean;
    private _examinerValidationArea: enums.ExaminerValidationArea;
    private _displayId: string;
    private _markingMode: enums.MarkingMode;
    private _examinerId: number;
    private _examinerRoleId: number;
    private _exceptionId: number;
    private _isTeamManagementTabSelect: boolean;
    /**
     * Constructor
     * @param success
     * @param failureCode
     * @param markSchemeGroupId
     */
    constructor(
        success: boolean,
        validateExaminerReturn: ValidateExaminerReturn,
        markSchemeGroupId: number,
        isFromRememberQig: boolean,
        examinerValidationArea: enums.ExaminerValidationArea,
        displayId: string, markingMode: enums.MarkingMode, examinerId: number,
        examinerRoleId: number, exceptionId: number, isTeamManagementTabSelect: boolean) {
        super(action.Source.View, actionType.VALIDATE_TEAM_MANAGEMENT_EXAMINER_ACTION, success);
        this._failureCode = validateExaminerReturn.failureCode;
        this._markSchemeGroupId = markSchemeGroupId;
        this._isFromRememberQig = isFromRememberQig;
        this._examinerValidationArea = examinerValidationArea;
        this._displayId = displayId;
        this._markingMode = markingMode;
        this._examinerId = examinerId;
        this._examinerRoleId = examinerRoleId;
        this._exceptionId = exceptionId;
        this._isTeamManagementTabSelect = isTeamManagementTabSelect;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Returns the failure Code
     */
    public get failureCode(): enums.FailureCode {
        return this._failureCode;
    }

    /**
     * Returns the mark Scheme GroupId
     */
    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }

    /**
     * Returns _isFromRememberQig
     */
    public get isFromRememberQig(): boolean {
        return this._isFromRememberQig;
    }

    /**
     * Returns ExaminerValidationArea
     */
    public get examinerValidationArea(): enums.ExaminerValidationArea {
        return this._examinerValidationArea;
    }

    /**
     * Returns Display Id
     */
    public get displayId(): string {
        return this._displayId;
    }

    /**
     * Returns Marking mode
     */
    public get markingMode(): enums.MarkingMode {
        return this._markingMode;
    }

    /**
     * Returns ExaminerId
     */
    public get examinerId(): number {
        return this._examinerId;
    }

    /**
     * Returns ExaminerRoleId
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

    /**
     * Returns exception id
     */
    public get exceptionId(): number {
        return this._exceptionId;
    }

    /**
     * Returns isTeamManagementTabSelect
     */
    public get isTeamManagementTabSelect(): boolean {
        return this._isTeamManagementTabSelect;
    }
}

export = ValidateTeamManagementExaminerAction;
