import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import candidateResponseMetadata = require('../../stores/script/typings/candidateresponsemetadata');
import enums = require('../../components/utility/enums');

/**
 * Action class for candidate script metadata retrieval
 */
class CandidateScriptMetadataRetrievalAction extends dataRetrievalAction {
    // Holds the Mark Scheme Group ID
    private markSchemeGroupId: number;

    // Holds the Question Paper ID
    private questionPaperId: number;

    // Holds the Candidate Response Metadata
    private candidateResponseMetadata: candidateResponseMetadata;

    // true for auto refresh call and false for normal call.
    private _isAutoRefreshCall: boolean;

    private _selectedStandardisationSetupWorklist: enums.StandardisationSetup;

    /**
     * Constructor for the action class
     * @param userActionType
     * @param markSchemeGroupId
     * @param questionPaperId
     * @param candidateResponseMetadata
     */
    constructor(
        userActionType: string,
        markSchemeGroupId: number,
        questionPaperId: number,
        candidateResponseMetadata: candidateResponseMetadata,
        isAutoRefreshCall: boolean,
        selectedStandardisationSetupWorklist: enums.StandardisationSetup
    ) {
        super(action.Source.View, userActionType, true);
        this.markSchemeGroupId = markSchemeGroupId;
        this.questionPaperId = questionPaperId;
        this.candidateResponseMetadata = candidateResponseMetadata;
        this._isAutoRefreshCall = isAutoRefreshCall;
        this._selectedStandardisationSetupWorklist = selectedStandardisationSetupWorklist;
    }

    /**
     * Returns the Mark Scheme Group ID
     */
    public getMarkSchemeGroupId() {
        return this.markSchemeGroupId;
    }

    /**
     * Returns the Question Paper ID
     */
    public getQuestionPaperId() {
        return this.questionPaperId;
    }

    /**
     * Returns the Candidate Response Metadata
     */
    public getCandidateResponseMetadata() {
        return this.candidateResponseMetadata;
    }

    /**
     * This will returns true for a auto refresh call
     */
    public get isAutoRefreshCall(): boolean {
        return this._isAutoRefreshCall;
    }

    public get selectedStandardisationSetupWorklist(): enums.StandardisationSetup {
        return this._selectedStandardisationSetupWorklist;
    }
}
export = CandidateScriptMetadataRetrievalAction;