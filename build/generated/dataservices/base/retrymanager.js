"use strict";
var localeStore = require('../../stores/locale/localestore');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var enums = require('../../components/utility/enums');
/**
 * Retry Manager class to retry the data services AJAX calls
 */
var RetryManager = (function () {
    function RetryManager() {
    }
    /**
     * Method which retries the AJAX call
     * The method initiates AJAX call and then if it fails, then it retries
     * the AJAX call for the configured number of times
     * @param method
     * @param fullUrl
     * @param data
     * @param numTries
     * @param callback
     */
    RetryManager.doRetry = function (numTries, callback) {
        var that = this;
        return callback().catch(function (error) {
            var networkErrorText = localeStore.instance.TranslateText('generic.error-dialog.body-network-error');
            // Checking if retry is required based on the exception
            // if browser is not connected to the internet then this won't retry.
            if (!that.isRetryRequired(error)) {
                if (error.handleException) {
                    window.onerror(error.xhr.responseText, '', null, null, error.xhr);
                }
                throw error;
            }
            // If the service error type is networkerror then throw error immeditialy.
            // Otherwise go for retry if the application is online.
            if (error.errorType === enums.DataServiceRequestErrorType.NetworkError) {
                throw error;
            }
            // If the number of retries left is 0, throw the error
            // There is no error text for the network error hence throw custom error
            if (numTries === 0) {
                if (error.handleException && (error.errorType === enums.DataServiceRequestErrorType.GenericError
                    || error.errorType === enums.DataServiceRequestErrorType.Unauthorized)) {
                    window.onerror(networkErrorText, '', null, null, error.xhr);
                }
                throw error;
            }
            // retry if browser is online
            if (applicationStore.instance.isOnline) {
                // Recurring the retry
                return that.doRetry(numTries - 1, callback);
            }
        });
    };
    /**
     * Method to check if the AJAX call should be retried or not
     * @param json
     */
    RetryManager.isRetryRequired = function (json) {
        var xhr = (json !== undefined && json.toString().length > 0) ? json.xhr : undefined;
        var statusCode = 0;
        var errorMessage = '';
        var shouldRetry = false;
        if (xhr && xhr !== 'undefined') {
            statusCode = xhr.status;
            errorMessage = (xhr.responseJSON !== undefined) ? xhr.responseJSON.error : '';
        }
        switch (statusCode) {
            // The AJAX call didn't reach the server due to a network error
            case 0:
                shouldRetry = true;
                break;
            // All other statuses
            default:
                shouldRetry = false;
                break;
        }
        return shouldRetry;
    };
    return RetryManager;
}());
module.exports = RetryManager;
//# sourceMappingURL=retrymanager.js.map