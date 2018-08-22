"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var backgroundWorkerParameters = require('../backgroundworkerparameters');
/**
 * Parameter class for the Script image download background worker
 */
var ScriptImageDownloadBackgroundWorkerParameters = (function (_super) {
    __extends(ScriptImageDownloadBackgroundWorkerParameters, _super);
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
    function ScriptImageDownloadBackgroundWorkerParameters(baseUrl, requestMethod, allowCors, refreshFrequency, requests) {
        _super.call(this, baseUrl, requestMethod, allowCors, refreshFrequency, requests);
    }
    return ScriptImageDownloadBackgroundWorkerParameters;
}(backgroundWorkerParameters));
module.exports = ScriptImageDownloadBackgroundWorkerParameters;
//# sourceMappingURL=scriptimagedownloadbackgroundworkerparameters.js.map