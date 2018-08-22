import backgroundWorkerParameters = require('../backgroundworkerparameters');
import scriptImageDownloadRequest = require('./scriptimagedownloadrequest');

/**
 * Parameter class for the Script image download background worker
 */
class ScriptImageDownloadBackgroundWorkerParameters extends backgroundWorkerParameters {

    /////**
    //// * Constructor for ScriptSynchroniserParameters
    //// * @param baseUrl
    //// * @param requestMethod
    //// * @param refreshFrequency
    //// * @param securityToken
    //// * @param requests
    //// */
    ////constructor(baseUrl: string,
    ////    requestMethod: string,
    ////    refreshFrequency: number,
    ////    securityToken: string,
    ////    requests: string[]) {
    ////    super(baseUrl, requestMethod, refreshFrequency, securityToken, requests);
    ////}

    /**
     * Constructor for ScriptSynchroniserParameters
     * @param baseUrl
     * @param requestMethod
     * @param refreshFrequency
     * @param requests
     */
    constructor(baseUrl: string,
        requestMethod: string,
        allowCors: boolean,
        refreshFrequency: number,
        requests: string[]) {
        super(baseUrl, requestMethod, allowCors, refreshFrequency, requests);
    }
}

export = ScriptImageDownloadBackgroundWorkerParameters;