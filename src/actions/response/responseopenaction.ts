import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class ResponseOpenAction extends dataRetrievalAction {

    private _selectedDisplayId: number;
    private _selectedResponseMode: enums.ResponseMode;
    private _responseNavigation: enums.ResponseNavigation;
    private _selectedMarkGroupId: number;
    private _responseViewMode: enums.ResponseViewMode;
    private _triggerPoint: enums.TriggerPoint = enums.TriggerPoint.None;
    private _sampleReviewCommentId: enums.SampleReviewComment = enums.SampleReviewComment.None;
	private _sampleReviewCommentCreatedBy: number;
    private _isWholeResponse: boolean;
    private _canRenderPreviousMarksInStandardisationSetup: boolean;
	private _candidateScriptId: number;
    private _isOnScreenHintVisible: boolean;
    private _examinerRoleId: number;
    private _hasDefinitiveMarks: boolean;

    /**
     * Constructor ResponseOpenAction
     * @param success
     * @param displayId
     * @param responseNaviagation
     * @param responseMode
     * @param markGroupId
     * @param responseViewMode
     * @param triggerPoint
     * @param json
     * @param sampleReviewCommentId
     * @param sampleReviewCommentCreatedBy
     * @param isWholeResponse
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    constructor(success: boolean,
        displayId: number,
        responseNaviagation: enums.ResponseNavigation,
        responseMode: enums.ResponseMode,
        markGroupId: number, responseViewMode: enums.ResponseViewMode,
        triggerPoint: enums.TriggerPoint,
        candidateScriptId: number,
        examinerRoleId: number,
        hasDefinitiveMarks: boolean,
        json?: any,
        sampleReviewCommentId: enums.SampleReviewComment = enums.SampleReviewComment.None,
		sampleReviewCommentCreatedBy: number = 0,
        isWholeResponse: boolean = false,
		canRenderPreviousMarksInStandardisationSetup: boolean = false,
        isOnScreenHintVisible: boolean = false
    ) {
        super(action.Source.View, actionType.OPEN_RESPONSE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._selectedDisplayId = displayId;
        this._selectedResponseMode = responseMode;
        this._responseNavigation = responseNaviagation;
        this._selectedMarkGroupId = markGroupId;
        this._responseViewMode = responseViewMode;
        this._triggerPoint = triggerPoint;
        this._sampleReviewCommentId = sampleReviewCommentId;
		this._sampleReviewCommentCreatedBy = sampleReviewCommentCreatedBy;
        this._isWholeResponse = isWholeResponse;
        this._canRenderPreviousMarksInStandardisationSetup = canRenderPreviousMarksInStandardisationSetup;
		this._candidateScriptId = candidateScriptId;
        this._isOnScreenHintVisible = isOnScreenHintVisible;
        this._examinerRoleId = examinerRoleId;
        this._hasDefinitiveMarks = hasDefinitiveMarks;
    }

    /**
     * This method will returns the selected responseId
     */
    public get selectedDisplayId(): number {
        return this._selectedDisplayId;
    }

    /**
     * This method will returns the selected response mode
     */
    public get selectedResponseMode(): enums.ResponseMode {
        return this._selectedResponseMode;
    }

    /*
     * This will returns the current response navigation type
     */
    public get responseNavigation(): enums.ResponseNavigation {
        return this._responseNavigation;
    }

    /**
     * This method will returns the selected markGroupId
     */
    public get selectedMarkGroupId(): number {
        return this._selectedMarkGroupId;
    }

    /**
     * This method will return the current responseViewMode
     */
    public get responseViewMode(): enums.ResponseViewMode {
        return this._responseViewMode;
    }

    /**
     * Returns the triggering point
     */
    public get triggerPoint(): enums.TriggerPoint {
        return this._triggerPoint;
    }

    /**
     * Returns the sample Review Comment Id
     */
    public get sampleReviewCommentId(): enums.SampleReviewComment {
        return this._sampleReviewCommentId;
    }

    /**
     * Returns the sample Review Comment CreatedBy
     */
    public get sampleReviewCommentCreatedBy(): number {
        return this._sampleReviewCommentCreatedBy;
	}

	/**
	 * Returns true if whole response
	 */
	public get isWholeResponse(): boolean {
		return this._isWholeResponse;
    }

    /**
     * return true if we can render previous marks in standardisation setup
     */
    public get canRenderPreviousMarksInStandardisationSetup(): boolean {
        return this._canRenderPreviousMarksInStandardisationSetup;
    }

    /**
     * Gets selected response candidateScriptId.
     */
    public get candidateScriptId(): number {
        return this._candidateScriptId;
	}

	/**
	 * return true if on Screen hint is visible.
	 */
	public get isOnScreenHintVisible(): boolean {
		return this._isOnScreenHintVisible;
    }

    /**
     * Gets whether standardisation setup response has definitive marks.
     */
    public get hasDefinitiveMarks(): boolean {
        return this._hasDefinitiveMarks;
    }

    /**
     * Gets Examiner role id.
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }
}

export = ResponseOpenAction;