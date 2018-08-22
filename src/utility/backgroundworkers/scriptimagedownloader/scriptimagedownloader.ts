import scriptImageDownloadRequest = require('./scriptimagedownloadrequest');
import scriptImageDownloadBackgroundWorkerParameters = require('./scriptimagedownloadbackgroundworkerparameters');
import urls = require('../../../dataservices/base/urls');
import loginSession = require('../../../app/loginsession');
import backgroundWorkerFactory = require('../backgroundworkerfactory');
import backgroundWorker = require('../backgroundworker');
import enums = require('../../../components/utility/enums');
import qigStore = require('../../../stores/qigselector/qigstore');
declare let config: any;

/**
 * Wrapper class for initiating background worker for script image download
 */
class ScriptImageDownloader {

    /**
     * Method which initiates the background download of script images based on MBQ or MBC
     * @param requests
     */
    public initiateBackgroundImageDownload(requests: scriptImageDownloadRequest[]) {

        let authorisedExaminerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;

        // Constructing the required background image download URLs
        let requestUrls: string[] = requests.map((request: scriptImageDownloadRequest) => {
            return urls.SCRIPT_IMAGE_DATA_URL +
                '/' + request.candidateScriptId +
                '/' + request.documentId +
                '/' + request.pageNumber +
                '/' + request.rowVersion + '/' +
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId +
                '/' + false + '/' + false;
        });

        let params = new scriptImageDownloadBackgroundWorkerParameters(
            config.general.SERVICE_BASE_URL,
            'GET',
            config.general.ALLOW_CORS,
            config.backgroundworkerrefreshconfig.SCRIPT_IMAGE_DOWNLOADER,
            ////loginSession.SECURITY_TOKEN,
            requestUrls
        );

        // Trying to get the instance of the background worker for the script image download
        let scriptDownloader: backgroundWorker = backgroundWorkerFactory.instance.getBackgroundWorker(
            enums.BackgroundWorkers.scriptImageDownloader
        );

        // If instance not found, initialise a new instance of the Script image downloader
        if (scriptDownloader === undefined) {
            scriptDownloader = backgroundWorkerFactory.instance.initialiseBackgroundWorker(enums.BackgroundWorkers.scriptImageDownloader);
        }

        // On getting the script image downloader instance, pass the parameters to the background worker
        // which shall invoke the downloader
        if (scriptDownloader !== undefined) {
            scriptDownloader.passParameters(params);
        }
    }

    /**
     * Method which clears the background download queue of the script images
     */
    public clearBackgroundImageDownloadQueue() {
        backgroundWorkerFactory.instance.clearBackgroundWorkerQueue(enums.BackgroundWorkers.scriptImageDownloader);
    }
}

export = ScriptImageDownloader;