/* tslint:disable:no-unused-variable */

import dispatcher = require('../../app/dispatcher');
import ErrorAction = require('./erroraction');
import loggingDataService = require('../../dataservices/logging/loggingdataservice');
import ErrorInfoArgument = require('../../dataservices/logging/errorinfoargument');
import enums = require('../../components/utility/enums');
import base = require('../base/actioncreatorbase');
/* tslint:enable:no-unused-variable */

class ErrorActionCreator extends base {
    /**
     * Save user audit action collection to Server.
     * @param {string} reason
     */
    public SaveToServer(errorInfoArgument: ErrorInfoArgument, userName: string): void {

        /** Logging user actions on error */
        loggingDataService.saveErrorLogg(errorInfoArgument, function (sucess: boolean) {
            dispatcher.dispatch(new ErrorAction(sucess, userName));
        },
            /** Handling logging API failure scenario  */
            function (failureCallbackHttpStatus: any) {
                if (failureCallbackHttpStatus.xhr.status >= enums.HttpErrorCode.badRequest
                    && failureCallbackHttpStatus.xhr.status <= enums.HttpErrorCode.internalServerError) {
                    dispatcher.dispatch(new ErrorAction(false, userName));
                }
            });
    }
    /** For logging error  */
    public LogError(userName: string): void {
        dispatcher.dispatch(new ErrorAction(false, userName));
    }
}

let errorActionCreator = new ErrorActionCreator();
export = errorActionCreator;