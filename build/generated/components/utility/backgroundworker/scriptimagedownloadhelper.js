"use strict";
var enums = require('../enums');
var scriptImageDownloadRequest = require('../../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloadrequest');
var worklistStore = require('../../../stores/worklist/workliststore');
var Immutable = require('immutable');
/**
 * Helper class for script image downloader
 */
var ScriptImageDownloadHelper = (function () {
    function ScriptImageDownloadHelper() {
    }
    /**
     * Method which returns the collection of candidate script information
     * @param responses
     */
    ScriptImageDownloadHelper.constructCandidateScriptInfo = function (responses) {
        var candidateScriptInfoCollection = [];
        responses.map(function (response) {
            candidateScriptInfoCollection.push({ candidateScriptId: Number(response.candidateScriptId), documentId: response.documentId });
        });
        return Immutable.List(candidateScriptInfoCollection);
    };
    /**
     * Method which tells if the background image download needs to be initiated based on the selected worklist
     * @param worklistType
     * @param responseMode
     */
    ScriptImageDownloadHelper.canInitiateScriptImageBackgroundDownload = function (worklistType, responseMode) {
        if (responseMode === enums.ResponseMode.open) {
            switch (worklistType) {
                case enums.WorklistType.live:
                    return worklistStore.instance.getLiveOpenWorklistDetails.responses.count() > 0;
                default:
                    return false;
            }
        }
        return false;
    };
    /**
     * Populates the background script image download requests
     * @param candidateResponseMetadata
     */
    ScriptImageDownloadHelper.populateBackgroundScriptImageDownloadRequests = function (candidateResponseMetadata) {
        var requests = [];
        candidateResponseMetadata.scriptImageList.forEach(function (script) {
            if (!script.isSuppressed) {
                requests.push(new scriptImageDownloadRequest(script.candidateScriptId, script.documentId, script.pageNumber, script.rowVersion));
            }
        });
        return requests;
    };
    return ScriptImageDownloadHelper;
}());
module.exports = ScriptImageDownloadHelper;
//# sourceMappingURL=scriptimagedownloadhelper.js.map