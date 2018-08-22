import dataServiceBase = require('../base/dataservicebase');
import errorInfoArgument = require('./errorinfoargument');
import urls = require('../base/urls');

class LoggingDataService extends dataServiceBase {

    /**
     * save the error log
     * @param errorInfoArgument
     * @param callback
     * @param failureCallback
     */
    public saveErrorLogg(errorInfoArgument: errorInfoArgument,
        callback: ((sucess: boolean) => void),
        failureCallback: ((httpStatus: any) => void)) {

        let url = urls.LOGGING_URL;
		/** Ajax call to get the frontend exception API . */
        let errorInfoJson = JSON.stringify(errorInfoArgument);
        let localePromise = this.makeAJAXCall('POST', url, errorInfoJson, false);
        localePromise.then(function (json: any) {
            if (callback) {
                callback(true);
            }
        }).catch(function (json: any) {
            if (failureCallback) {
                failureCallback(json);
            }
            });
    }
}
let loggingDataservice = new LoggingDataService();
export = loggingDataservice;