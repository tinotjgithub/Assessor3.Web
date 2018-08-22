"use strict";
var AllocateArgument = (function () {
    /**
     * Initializing new instance of allocation.
     */
    function AllocateArgument(examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, isQualityRemarkCCEnabled, remarkRequestType, isAtypicalReponse, candidateScriptId, isWholeResponseDownload) {
        this.examinerRoleId = examinerRoleId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.workListType = workListType;
        this.isConcurrentDownload = isConcurrentDownload;
        this.examSessionId = examSessionId;
        this.isPE = isPE;
        this.isElectronicStandardisationTeamMember = isElectronicStandardisationTeamMember;
        this.examinerId = examinerId;
        this.isCandidatePrioritisationCCON = isCandidatePrioritisationCCON;
        this.isQualityRemarkCCEnabled = isQualityRemarkCCEnabled;
        this.remarkRequestType = remarkRequestType;
        this.isAtypicalReponse = isAtypicalReponse;
        this.candidateScriptId = candidateScriptId;
        this.isWholeResponse = isWholeResponseDownload;
    }
    return AllocateArgument;
}());
module.exports = AllocateArgument;
//# sourceMappingURL=allocateargument.js.map