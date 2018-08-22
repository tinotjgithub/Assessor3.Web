import enums = require('../enums');
import candidateScriptInfo = require('../../../dataservices/script/typings/candidatescriptinfo');
import scriptImageDownloadRequest = require('../../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloadrequest');
import candidateResponseMetadata = require('../../../stores/script/typings/candidateresponsemetadata');
import worklistStore = require('../../../stores/worklist/workliststore');
import Immutable = require('immutable');
/**
 * Helper class for script image downloader
 */
class ScriptImageDownloadHelper {

    /**
     * Method which returns the collection of candidate script information
     * @param responses
     */
    public static constructCandidateScriptInfo(responses: ResponseBase[]): Immutable.List<candidateScriptInfo> {
        let candidateScriptInfoCollection = [];
        responses.map((response: ResponseBase) => {
            candidateScriptInfoCollection.push({ candidateScriptId: Number(response.candidateScriptId), documentId: response.documentId });
        });

        return Immutable.List<candidateScriptInfo>(candidateScriptInfoCollection);
    }

    /**
     * Method which tells if the background image download needs to be initiated based on the selected worklist
     * @param worklistType
     * @param responseMode
     */
    public static canInitiateScriptImageBackgroundDownload(worklistType: enums.WorklistType, responseMode: enums.ResponseMode): boolean {
        if (responseMode === enums.ResponseMode.open) {
            switch (worklistType) {
                case enums.WorklistType.live:
                    return worklistStore.instance.getLiveOpenWorklistDetails.responses.count() > 0;
                default:
                    return false;
            }
        }
        return false;
    }

    /**
     * Populates the background script image download requests
     * @param candidateResponseMetadata
     */
    public static populateBackgroundScriptImageDownloadRequests(
        candidateResponseMetadata: candidateResponseMetadata
    ): scriptImageDownloadRequest[] {
        let requests: scriptImageDownloadRequest[] = [];

        candidateResponseMetadata.scriptImageList.forEach((script: ScriptImage) => {
            if (!script.isSuppressed) {
                requests.push(
                    new scriptImageDownloadRequest(
                        script.candidateScriptId,
                        script.documentId,
                        script.pageNumber,
                        script.rowVersion
                    )
                );
            }
        });

        return requests;
    }
}

export = ScriptImageDownloadHelper;