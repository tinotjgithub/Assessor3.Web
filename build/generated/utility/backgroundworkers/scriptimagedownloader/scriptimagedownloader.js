"use strict";
var scriptImageDownloadBackgroundWorkerParameters = require('./scriptimagedownloadbackgroundworkerparameters');
var urls = require('../../../dataservices/base/urls');
var backgroundWorkerFactory = require('../backgroundworkerfactory');
var enums = require('../../../components/utility/enums');
var qigStore = require('../../../stores/qigselector/qigstore');
/**
 * Wrapper class for initiating background worker for script image download
 */
var ScriptImageDownloader = (function () {
    function ScriptImageDownloader() {
    }
    /**
     * Method which initiates the background download of script images based on MBQ or MBC
     * @param requests
     */
    ScriptImageDownloader.prototype.initiateBackgroundImageDownload = function (requests) {
        var authorisedExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        // Constructing the required background image download URLs
        var requestUrls = requests.map(function (request) {
            return urls.SCRIPT_IMAGE_DATA_URL +
                '/' + request.candidateScriptId +
                '/' + request.documentId +
                '/' + request.pageNumber +
                '/' + request.rowVersion + '/' +
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId + '/';
        });
        var params = new scriptImageDownloadBackgroundWorkerParameters(config.general.SERVICE_BASE_URL, 'GET', config.general.ALLOW_CORS, config.backgroundworkerrefreshconfig.SCRIPT_IMAGE_DOWNLOADER, 
        ////loginSession.SECURITY_TOKEN,
        requestUrls);
        // Trying to get the instance of the background worker for the script image download
        var scriptDownloader = backgroundWorkerFactory.instance.getBackgroundWorker(enums.BackgroundWorkers.scriptImageDownloader);
        // If instance not found, initialise a new instance of the Script image downloader
        if (scriptDownloader === undefined) {
            scriptDownloader = backgroundWorkerFactory.instance.initialiseBackgroundWorker(enums.BackgroundWorkers.scriptImageDownloader);
        }
        // On getting the script image downloader instance, pass the parameters to the background worker
        // which shall invoke the downloader
        if (scriptDownloader !== undefined) {
            scriptDownloader.passParameters(params);
        }
    };
    /**
     * Method which clears the background download queue of the script images
     */
    ScriptImageDownloader.prototype.clearBackgroundImageDownloadQueue = function () {
        backgroundWorkerFactory.instance.clearBackgroundWorkerQueue(enums.BackgroundWorkers.scriptImageDownloader);
    };
    return ScriptImageDownloader;
}());
module.exports = ScriptImageDownloader;
//# sourceMappingURL=scriptimagedownloader.js.map