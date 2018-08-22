"use strict";
/**
 * Class for background worker parameters
 */
var BackgroundWorkerParameters = (function () {
    /////**
    //// * Constructor for the synchroniser parameter class
    //// * @param baseUrl
    //// * @param requestMethod
    //// * @param refreshFrequency
    //// * @param securityToken
    //// * @param requests
    //// */
    ////constructor(baseUrl: string, requestMethod: string, refreshFrequency: number, securityToken: string, requests: string[]) {
    ////    this.baseUrl = baseUrl;
    ////    this.requestMethod = requestMethod;
    ////    this.securityToken = securityToken;
    ////    this.refreshFrequency = refreshFrequency;
    ////    this.requests = requests;
    ////}
    /**
     * Constructor for the synchroniser parameter class
     * @param baseUrl
     * @param requestMethod
     * @param refreshFrequency
     * @param requests
     */
    function BackgroundWorkerParameters(baseUrl, requestMethod, allowCors, refreshFrequency, requests) {
        this.baseUrl = baseUrl;
        this.requestMethod = requestMethod;
        this.allowCors = allowCors;
        this.refreshFrequency = refreshFrequency;
        this.requests = requests;
    }
    return BackgroundWorkerParameters;
}());
module.exports = BackgroundWorkerParameters;
//# sourceMappingURL=backgroundworkerparameters.js.map