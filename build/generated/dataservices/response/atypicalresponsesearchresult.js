"use strict";
var AtypicalResponseSearchResult = (function () {
    /**
     * Initializing new instance of atypical search result.
     */
    function AtypicalResponseSearchResult(examinerRoleId, markSchemeGroupId, centreNumber, candidateNumber, searchResultCode, candidateScriptId, candidateName) {
        this.examinerRoleId = examinerRoleId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.centreNumber = centreNumber;
        this.candidateNumber = candidateNumber;
        this.searchResultCode = searchResultCode;
        this.candidateScriptId = candidateScriptId;
        this.candidateName = candidateName;
    }
    return AtypicalResponseSearchResult;
}());
module.exports = AtypicalResponseSearchResult;
//# sourceMappingURL=atypicalresponsesearchresult.js.map