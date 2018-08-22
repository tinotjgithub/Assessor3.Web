import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import candidateECourseWorkMetadata = require('../../stores/script/typings/candidateecourseworkmetadata');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');

/**
 * Action class for candidate e-course work metadata retrieval
 */
class CandidateECourseWorkMetadataRetrievalAction extends dataRetrievalAction {

    // holds candidate e-course work files metadata
    private candidateECourseWorkMetadata: candidateECourseWorkMetadata;
    private _isSelectResponsesWorklist: boolean;

    /**
     * Constructor for the action class
     * @param userActionType 
     * @param candidateECourseWorkMetadata 
     * @param isSelectResponsesWorklist 
     */
    constructor(userActionType: string, candidateECourseWorkMetadata: candidateECourseWorkMetadata,
        isSelectResponsesWorklist: boolean) {
        super(action.Source.View, userActionType, true);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, 'true');
        this.candidateECourseWorkMetadata = candidateECourseWorkMetadata;
        this._isSelectResponsesWorklist = isSelectResponsesWorklist;
    }

    /**
     * returns candidate e-course work metadata
     */
    public getCandidateECourseWorkMetadata() {
        return this.candidateECourseWorkMetadata;
    }

    /** 
     * Returns true, if selectedResponses currentSession worklist is selected.
     */
    public get isSelectResponsesWorklist() {
        return this._isSelectResponsesWorklist;
    }
}
export = CandidateECourseWorkMetadataRetrievalAction;