"use strict";
/**
 * Class for representing the argument for candidate response metadata retrieval
 */
var CandidateResponseMetadataArgument = (function () {
    /**
     * Constructor for CandidateResponseMetadataArgument
     * @param candidateScripts
     * @param markSchemeGroupId
     * @param questionPaperId
     * @param isECoursework
     */
    function CandidateResponseMetadataArgument(candidateScripts, markSchemeGroupId, questionPaperId, isECoursework, isEBookMarking, isAwarding, suppressPagesInAwarding, isMarkFromObject) {
        this.candidateScripts = candidateScripts;
        this.markSchemeGroupId = markSchemeGroupId;
        this.questionPaperId = questionPaperId;
        this.isECoursework = isECoursework;
        this.isEBookMarking = isEBookMarking;
        this.isAwarding = isAwarding;
        this.suppressPagesInAwarding = suppressPagesInAwarding;
        this.isMarkFromObject = isMarkFromObject;
    }
    return CandidateResponseMetadataArgument;
}());
module.exports = CandidateResponseMetadataArgument;
//# sourceMappingURL=candidateresponsemetadataargument.js.map