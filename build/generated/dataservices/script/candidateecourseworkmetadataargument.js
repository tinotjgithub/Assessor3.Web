"use strict";
/**
 * argument for candidate e-course work metadata retrieval
 */
var CandidateECourseWorkMetadataArgument = (function () {
    /**
     * Constructor for CandidateResponseMetadataArgument
     * @param candidateScriptInputArgument
     * @param examinerId
     */
    function CandidateECourseWorkMetadataArgument(candidateScriptInputArgument, examinerId, examinerRoleId, isStandardisationSetupMode) {
        // list of candidate script details
        this.candidateScriptInputArgument = [];
        this.candidateScriptInputArgument = candidateScriptInputArgument.toArray();
        this.examinerId = examinerId;
        this.examinerRoleId = examinerRoleId;
        this.isStandardisationSetupMode = isStandardisationSetupMode;
    }
    return CandidateECourseWorkMetadataArgument;
}());
module.exports = CandidateECourseWorkMetadataArgument;
//# sourceMappingURL=candidateecourseworkmetadataargument.js.map