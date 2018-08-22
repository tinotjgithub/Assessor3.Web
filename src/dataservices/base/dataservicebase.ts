import loginSession = require('../../app/loginsession');
import $ = require('jquery');
import Promise = require('es6-promise');
import urls = require('./urls');
import retrymanager = require('./retrymanager');
import backgroundworkerSynchroniserHelper = require('../../utility/backgroundworkers/backgroundworkersynchroniserhelper');
declare let config: any;
import enums = require('../../components/utility/enums');
import serviceErrorReturn = require('./serviceerrorreturn');
import concurrentSessionErrorReturn = require('./concurrentsessionerrorreturn');
import cookie = require('react-cookie');
import constants = require('../../components/utility/constants');

/**
 * Base class for making Ajax
 */
class DataServiceBase {
    /**
     * Ajax call method, this method initiates the AJAX call
     * @param method
     * @param url - full url.
     * @param successCallback
     * @param failureCallback
     * @param data
     * @param doRequireAuthorization
     */
    protected makeAJAXCallWithFullUrl(method: string,
        url: string,
        data?: string,
        doRequireAuthorization: boolean = true,
        handleException: boolean = true,
        priority: enums.Priority = enums.Priority.First): Promise<any> {

        if (priority === enums.Priority.First) {
            loginSession.FOREGROUND_REQUEST_COUNT++;

        } else if (priority === enums.Priority.Second) {

            loginSession.SECOND_PRIORITY_REQUEST_COUNT++;
        }

        // Just changed from 0 to 1, so pause background tasks
        if (loginSession.FOREGROUND_REQUEST_COUNT >= 1 || loginSession.SECOND_PRIORITY_REQUEST_COUNT >= 1) {
            backgroundworkerSynchroniserHelper.instance.informSynchronisers(true);
        }

        // Before making the dataservice call, the current login should be validated for any cookie change
        let promise: Promise<any> = null;
        var sessionIdentifier: string = cookie.load(constants.SESSION_IDENTIFIER_COOKIE, true);
        if (loginSession.SESSION_IDENTIFIER && sessionIdentifier) {
            if (loginSession.SESSION_IDENTIFIER !== sessionIdentifier && sessionIdentifier != null) {
                promise = new Promise.Promise(function (resolve: any, reject: any) {
                    reject(new concurrentSessionErrorReturn(''));
                });
                return promise;
            }
        }
        return this.getPromise(method, url, data, doRequireAuthorization, handleException, priority);
    }

    /**
     * This method will returns the corresponding promise based on priority.
     * @param method
     * @param url
     * @param data
     * @param doRequireAuthorization
     * @param handleException
     * @param priority
     */
    private getPromise(method: string,
        url: string,
        data?: string,
        doRequireAuthorization: boolean = true,
        handleException: boolean = true,
        priority: enums.Priority = enums.Priority.First): Promise<any> {

        let promise: Promise<any> = null;

        if ((priority === enums.Priority.First) || (priority === enums.Priority.Second && loginSession.FOREGROUND_REQUEST_COUNT === 0)) {
            promise = new Promise.Promise(function (resolve: any, reject: any) {

                $.ajax({
                    type: method,
                    url: url,
                    processData: true,
                    data: data,
                    contentType: 'application/json',
                    xhrFields: {
                        // This is for supporting CORS requests
                        withCredentials: config.general.ALLOW_CORS
                    },
                    dataType: 'json',
                    timeout: config.general.DATA_SERVICE_CALL_TIME_OUT,
                    headers: doRequireAuthorization ? {
                        ////'Authorization': 'bearer ' + loginSession.SECURITY_TOKEN,
                        'Content-Type': 'application/json;charset=utf-8'
                    } : {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                    success: function (json: any) {
                        if (priority === enums.Priority.First) {
                            loginSession.FOREGROUND_REQUEST_COUNT--;
                        } else if (priority === enums.Priority.Second) {
                            loginSession.SECOND_PRIORITY_REQUEST_COUNT--;
                        }
                        // Just changed from 0 to 1, so pause background tasks
                        if (loginSession.FOREGROUND_REQUEST_COUNT <= 0 && loginSession.SECOND_PRIORITY_REQUEST_COUNT <= 0) {
                            backgroundworkerSynchroniserHelper.instance.informSynchronisers(false);
                        }
                        resolve(json);
                    },
                    error: function (xhr: any, status: any, error: string) {
                        if (priority === enums.Priority.First) {
                            loginSession.FOREGROUND_REQUEST_COUNT--;
                        } else if (priority === enums.Priority.Second) {
                            loginSession.SECOND_PRIORITY_REQUEST_COUNT--;
                        }
                        // Just changed from 0 to 1, so pause background tasks
                        //if (loginSession.FOREGROUND_REQUEST_COUNT <= 0 && loginSession.SECOND_PRIORITY_REQUEST_COUNT <= 0) {
                        //  backgroundworkerSynchroniserHelper.instance.informSynchronisers(false);
                        //} else
                        if (xhr.status === 0) {

                            backgroundworkerSynchroniserHelper.instance.informSynchronisers(true);
                        }

                        reject(new serviceErrorReturn(xhr, status, error, handleException));
                    }
                });
            });
        } else {

            promise = new Promise.Promise(function (resolve: any, reject: any) {

                if (priority as enums.Priority === enums.Priority.First) {
                    loginSession.FOREGROUND_REQUEST_COUNT--;
                } else if (priority === enums.Priority.Second) {
                    loginSession.SECOND_PRIORITY_REQUEST_COUNT--;
                }
                // Just changed from 0 to 1, so pause background tasks
                if (loginSession.FOREGROUND_REQUEST_COUNT <= 0 && loginSession.SECOND_PRIORITY_REQUEST_COUNT <= 0) {
                    backgroundworkerSynchroniserHelper.instance.informSynchronisers(false);
                }

                reject(new serviceErrorReturn(null, null, '', false));
            });
        }

        return promise;
    }




   /**
    * Ajax call method
    * This makes AJAX calls appending a security header
    * @param method
    * @param url - appending this to base url in cofig to create a full url.
    * @param successCallback
    * @param failureCallback
    * @param data
    */
    protected makeAJAXCall(method: string,
        url: string,
        data?: string,
        handleException: boolean = true,
        shouldRetry: boolean = true,
        priority: enums.Priority = enums.Priority.First): Promise<any> {
        // If Security Token in login session is null, then the user needs to log in.
        if (!loginSession.IS_AUTHENTICATED) {
            return new Promise.Promise((resolve: any, reject: any) => { /* tslint:disable:no-empty */ });
        }

        ////let promise = this.handleAccessTokenExpiry();
        ////let fullUrl = url = config.general.SERVICE_BASE_URL + url;
        ////let retryCount: number = 0;
        ////if (!shouldRetry) {
        ////    retryCount = 0;
        ////}else {
        ////    retryCount = config.general.RETRY_ATTEMPT_COUNT;
        ////}
        ////return promise.then(() => {
        ////    return retrymanager.doRetry(retryCount, () =>
        ////        this.makeAJAXCallWithFullUrl(method, fullUrl, data, true, handleException, priority));
        ////}).catch();

        let fullUrl = url = config.general.SERVICE_BASE_URL + url;
        let retryCount: number = 0;
        if (!shouldRetry) {
            retryCount = 0;
        } else {
            retryCount = config.general.RETRY_ATTEMPT_COUNT;
        }

        return retrymanager.doRetry(retryCount, () =>
            this.makeAJAXCallWithFullUrl(method, fullUrl, data, true, handleException, priority));
    }

 /**
  * Ajax call method
  * This makes AJAX calls without appending a security header (For eg: Login).
  * @param method
  * @param url - appending this to base url in cofig to create a full url.
  * @param successCallback
  * @param failureCallback
  * @param data
  */
    protected makeAJAXCallWithoutHeader(method: string, url: string, data?: any): Promise<any> {
        let fullUrl = url = config.general.SERVICE_BASE_URL + url;
        // Making the AJAX call through the retry manager
        return retrymanager.doRetry(
            config.general.RETRY_ATTEMPT_COUNT,
            () => this.makeAJAXCallWithFullUrl(method, fullUrl, data, false, false)
        );
    }

    /**
     * Method to handle Access token expiry, calls service to renew access token using a refresh token.
     */
    ////protected handleAccessTokenExpiry(): Promise<any> {
    ////    let that = this;
    ////    let promise = new Promise.Promise(function (resolve: any, reject: any) {

    ////        // Difference between Date.now() and the time stamp of login will give the duration of token life,
    ////        // if it has passed more than 80% of its lifetime we renew it.
    ////        if ((((Date.now() / 1000) - loginSession.TOKEN_TIME_STAMP) / loginSession.TOKEN_EXPIRY) >= .80) {
    ////            // Refresh the access token here.
    ////            let data = 'Content-Type=application/x-www-form-urlencoded'
    ////                        + '&grant_type=refresh_token'
    ////                        + '&refresh_token=' + encodeURIComponent(loginSession.REFRESH_TOKEN)
    ////                        + '&marking_session_tracking_id=' + loginSession.MARKING_SESSION_TRACKING_ID;

				////// Making the AJAX call through the retry manager
    ////            let promiseCallToService = retrymanager.doRetry(config.general.RETRY_ATTEMPT_COUNT, () =>
    ////                               that.makeAJAXCallWithoutHeader('POST', urls.AUTHENTICATE_URL, data));

    ////            promiseCallToService.then((json: any) => {
    ////                // Successfully Refreshed the token, set the new tokens and the time stamp.
    ////                loginSession.SECURITY_TOKEN = json.access_token;
    ////                loginSession.REFRESH_TOKEN = json.refresh_token;
    ////                loginSession.TOKEN_EXPIRY = json.expires_in;
    ////                loginSession.TOKEN_TIME_STAMP = Date.now() / 1000;
    ////                resolve();
    ////            }).catch(() => { reject(); });
    ////        } else {
    ////            // Token not expired yet, resolve straightaway.
    ////            resolve();
    ////        }
    ////    });

    ////    return promise;
    ////}

    /**
     * *This metho is to make an Ajax call without specifying the datatype return
     * @param method
     * @param url
     */
    protected makeAJAXCallWithoutDatatype(method: string, url: string): Promise<any> {
        // If Security Token in login session is null, then the user needs to log in.
        if (!loginSession.IS_AUTHENTICATED) {
            return new Promise.Promise((resolve: any, reject: any) => { /* tslint:disable:no-empty */ });
        }

        ////let promise = this.handleAccessTokenExpiry();
        let retryCount: number = 0;

        // Retry with general configuration
        retryCount = config.general.RETRY_ATTEMPT_COUNT;

        ////return promise.then(() => {

        return retrymanager.doRetry(retryCount, () => {
            loginSession.FOREGROUND_REQUEST_COUNT++;

            // Just changed from 0 to 1, so pause background tasks
            if (loginSession.FOREGROUND_REQUEST_COUNT === 1) {
                backgroundworkerSynchroniserHelper.instance.informSynchronisers(true);
            }

            return new Promise.Promise(function (resolve: any, reject: any) {
                $.ajax({
                    type: method,
                    url: url,
                    processData: true,
                    xhrFields: {
                        // This is for supporting CORS requests
                        withCredentials: config.general.ALLOW_CORS
                    },
                    timeout: config.general.DATA_SERVICE_CALL_TIME_OUT,
                    ////headers: {
                    ////    'Authorization': 'bearer ' + loginSession.SECURITY_TOKEN
                    ////},
                    success: function (json: any) {
                        loginSession.FOREGROUND_REQUEST_COUNT--;

                        // Foreground calls all done, so we can restart background tasks
                        if (loginSession.FOREGROUND_REQUEST_COUNT === 0) {
                            backgroundworkerSynchroniserHelper.instance.informSynchronisers(false);
                        }

                        resolve(json);
                    },
                    error: function (xhr: any, status: any, error: string) {
                        loginSession.FOREGROUND_REQUEST_COUNT--;

                        // Foreground calls all done, so we can restart background tasks
                        if (xhr.status === 0) {
                            backgroundworkerSynchroniserHelper.instance.informSynchronisers(true);
                        }

                        reject(new serviceErrorReturn(xhr, status, error, true));
                    }
                });
            });
        });
    }
}

export = DataServiceBase;