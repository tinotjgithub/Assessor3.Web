"use strict";
var enums = require('../../components/utility/enums');
/**
 * Holds the data service failure reason
 */
var ServiceErrorReturn = (function () {
    /**
     * Initialising instance of service error return.
     * @param {any} xhr
     * @param {any} status
     * @param {string} error
     */
    function ServiceErrorReturn(xhr, status, error, handleException) {
        this._xhr = xhr;
        this._status = status;
        this._error = error;
        this._handleException = handleException;
    }
    Object.defineProperty(ServiceErrorReturn.prototype, "xhr", {
        /**
         * Gets a value indicating the dataservice error
         * @returns
         */
        get: function () {
            return this._xhr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceErrorReturn.prototype, "status", {
        /**
         * Gets a value indicating the dataservice error status
         * @returns
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceErrorReturn.prototype, "error", {
        /**
         * Gets a value indicating the dataservice error
         * @returns
         */
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceErrorReturn.prototype, "errorType", {
        /**
         * Gets a value indicating the dataservice error
         * @returns
         */
        get: function () {
            // holds the error type
            var dataServiceRequestErrorType;
            if (!this._xhr) {
                dataServiceRequestErrorType = enums.DataServiceRequestErrorType.Skipped;
            }
            else {
                switch (this._xhr.status) {
                    case 401:
                        dataServiceRequestErrorType = enums.DataServiceRequestErrorType.Unauthorized;
                        break;
                    case 0:
                        dataServiceRequestErrorType = enums.DataServiceRequestErrorType.NetworkError;
                        break;
                    default:
                        dataServiceRequestErrorType = enums.DataServiceRequestErrorType.GenericError;
                        break;
                }
            }
            return dataServiceRequestErrorType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceErrorReturn.prototype, "handleException", {
        /**
         * Gets a value indicating to handle the exception.
         * @returns
         */
        get: function () {
            return this._handleException;
        },
        enumerable: true,
        configurable: true
    });
    return ServiceErrorReturn;
}());
module.exports = ServiceErrorReturn;
//# sourceMappingURL=serviceerrorreturn.js.map