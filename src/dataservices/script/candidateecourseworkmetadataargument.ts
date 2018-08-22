import eCourseworkArgument = require('./typings/ecourseworkarguments');
import Immutable = require('immutable');

/**
 * argument for candidate e-course work metadata retrieval
 */
class CandidateECourseWorkMetadataArgument {

    // list of candidate script details
    private candidateScriptInputArgument = [];

    // Holds the Mark Scheme Group ID
    private examinerId: number;

    // Holds the examiner role ID
    private examinerRoleId: number;

    // Indicates whether the marker is in standardisation setup or not
    private isStandardisationSetupMode: boolean;

    /**
     * Constructor for CandidateResponseMetadataArgument
     * @param candidateScriptInputArgument
     * @param examinerId
     */
    constructor(candidateScriptInputArgument: Immutable.List<eCourseworkArgument>, examinerId: number, examinerRoleId: number,
        isStandardisationSetupMode: boolean) {
        this.candidateScriptInputArgument = candidateScriptInputArgument.toArray();
        this.examinerId = examinerId;
        this.examinerRoleId = examinerRoleId;
        this.isStandardisationSetupMode = isStandardisationSetupMode;
    }
}

export = CandidateECourseWorkMetadataArgument;