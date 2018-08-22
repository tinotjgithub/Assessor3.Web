/* tslint:disable:no-unused-variable */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var ErrorAction = require('./erroraction');
var loggingDataService = require('../../dataservices/logging/loggingdataservice');
var enums = require('../../components/utility/enums');
var base = require('../base/actioncreatorbase');
/* tslint:enable:no-unused-variable */
var ErrorActionCreator = (function (_super) {
    __extends(ErrorActionCreator, _super);
    function ErrorActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Save user audit action collection to Server.
     * @param {string} reason
     */
    ErrorActionCreator.prototype.SaveToServer = function (errorInfoArgument, userName) {
        /** Logging user actions on error */
        loggingDataService.saveErrorLogg(errorInfoArgument, function (sucess) {
            dispatcher.dispatch(new ErrorAction(sucess, userName));
        }, 
        /** Handling logging API failure scenario  */
        function (failureCallbackHttpStatus) {
            if (failureCallbackHttpStatus.xhr.status >= enums.HttpErrorCode.badRequest
                && failureCallbackHttpStatus.xhr.status <= enums.HttpErrorCode.internalServerError) {
                dispatcher.dispatch(new ErrorAction(false, userName));
            }
        });
    };
    /** For logging error  */
    ErrorActionCreator.prototype.LogError = function (userName) {
        dispatcher.dispatch(new ErrorAction(false, userName));
    };
    return ErrorActionCreator;
}(base));
var errorActionCreator = new ErrorActionCreator();
module.exports = errorActionCreator;
//# sourceMappingURL=erroractioncreator.js.map