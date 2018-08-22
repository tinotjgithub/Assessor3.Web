import candidateScriptInfo = require('./typings/candidatescriptinfo');
/**
 * Class for representing the argument for candidate response metadata retrieval
 */
class CandidateResponseMetadataArgument {
    // Holds the candidate script infos
    private candidateScripts: Immutable.List<candidateScriptInfo>;

    // Holds the Mark Scheme Group ID
    private markSchemeGroupId: number;

    // Holds the Question Paper ID
    private questionPaperId: number;

    // is e-course work
    private isECoursework: boolean;

    //Determines whether ebookmarking or not
    private isEBookMarking: boolean;

    // Value indicating whether it is an awarding operation
    private isAwarding: boolean;

    // Value indicating whether pages needs to be suppressed in Awarding
    private suppressPagesInAwarding: boolean;

    // Value indicating whether MFO component or not
    private isMarkFromObject: boolean;

    /**
     * Constructor for CandidateResponseMetadataArgument
     * @param candidateScripts
     * @param markSchemeGroupId
     * @param questionPaperId
     * @param isECoursework
     */
    constructor(candidateScripts: Immutable.List<candidateScriptInfo>, markSchemeGroupId: number, questionPaperId: number,
        isECoursework: boolean, isEBookMarking: boolean, isAwarding: boolean, suppressPagesInAwarding: boolean,
        isMarkFromObject: boolean) {
        this.candidateScripts = candidateScripts;
        this.markSchemeGroupId = markSchemeGroupId;
        this.questionPaperId = questionPaperId;
        this.isECoursework = isECoursework;
        this.isEBookMarking = isEBookMarking;
        this.isAwarding = isAwarding;
        this.suppressPagesInAwarding = suppressPagesInAwarding;
        this.isMarkFromObject = isMarkFromObject;
    }
}

export = CandidateResponseMetadataArgument;