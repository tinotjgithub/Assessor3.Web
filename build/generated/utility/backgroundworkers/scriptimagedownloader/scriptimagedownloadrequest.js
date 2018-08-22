"use strict";
/**
 * The request class for Image download
 */
var ScriptImageDownloadRequest = (function () {
    /**
     * Constructor for the ScriptImageDownloadRequest
     * @param candidateScriptId
     * @param documentId
     * @param pageNumber
     * @param rowVersion
     */
    function ScriptImageDownloadRequest(candidateScriptId, documentId, pageNumber, rowVersion) {
        this.candidateScriptId = candidateScriptId;
        this.documentId = documentId;
        this.pageNumber = pageNumber;
        this.rowVersion = rowVersion;
    }
    return ScriptImageDownloadRequest;
}());
module.exports = ScriptImageDownloadRequest;
//# sourceMappingURL=scriptimagedownloadrequest.js.map