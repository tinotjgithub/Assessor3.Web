import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import candidateEBookMarkImageZoneCollection = require('../../stores/script/typings/candidateebookmarkimagezonecollection');

/**
 * Action class for candidate ebookmark image zone collection retrieval
 */
class CandidateEBookMarkImageZoneRetrievalAction extends dataRetrievalAction {

    // holds candidate ebookmark image zone collection
    private candidateScriptEBookMarkImageZoneCollection: candidateEBookMarkImageZoneCollection;
    private _questionPaperId: number;

    /**
     * Constructor for the action class
     * @param userActionType
     * @param candidateEBookMarkImageZoneCollection
     */
    constructor(userActionType: string, candidateScriptEBookMarkImageZoneCollection: candidateEBookMarkImageZoneCollection,
        questionPaperId: number) {
        super(action.Source.View, userActionType, true);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, 'true');
        this.candidateScriptEBookMarkImageZoneCollection = candidateScriptEBookMarkImageZoneCollection;
        this._questionPaperId = questionPaperId;
    }

    /**
     * returns candidate ebookmark image zone collection
     */
    public get getCandidateScriptEBookMarkImageZoneCollection(): candidateEBookMarkImageZoneCollection {
        return this.candidateScriptEBookMarkImageZoneCollection;
    }

    public get questionPaperId(): number {
        return this._questionPaperId;
    }
}
export = CandidateEBookMarkImageZoneRetrievalAction;