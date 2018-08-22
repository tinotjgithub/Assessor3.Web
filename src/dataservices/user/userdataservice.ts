import dataserviceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import userOptionData = require('../../stores/useroption/typings/useroptiondata');
import Immutable = require('immutable');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');

class UserDataService extends dataserviceBase {

    /**
     * Determines whether to retrieve data from cache or needs a service call and returns the data.
     * @param {((success} callback
     * @param {function} userOptions
     */
    public retrieveUserOptions(callback: ((success: boolean, json?: any) => void), useCache: boolean = false) {
        let getUrl = urls.USER_OPTIONS_GET_URL;
        let that = this;

        if (useCache) {

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('user',
                'userInformation',
                true,
                0);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                that.retrieveUserOptionsFromServer(callback);
            });
        } else {
            this.retrieveUserOptionsFromServer(callback);
        }
    }

    /**
     * Retrieving user option as JSON object from server
     * @param {((success} callback
     */
    private retrieveUserOptionsFromServer(callback: Function) {

        let getUrl = urls.USER_OPTIONS_GET_URL;
        let that = this;

        let localePromise = this.makeAJAXCall('GET', getUrl);
        localePromise.then(function (json: any) {
            if (callback) {

                // need to use a single ref as the updates are going to take place
                // on one single ref.
                let data = that.getImmutable(JSON.parse(json));
                storageAdapterFactory.getInstance().storeData('user', 'userInformation',
                    data, true).then().catch();

                callback(true, data);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * saving user options into server
     * @param {JSON} userOptionsJson
     * @param {((success} callback
     */
    public saveUserOptions(userOptionsJson: userOptionData, callback: ((success: boolean, json?: any) => void)) {
        let userOptions: string;
        userOptions = JSON.stringify(userOptionsJson);
        let saveUrl = urls.USER_OPTIONS_SAVE_URL;
        let localePromise = this.makeAJAXCall('POST', saveUrl, userOptions);
        localePromise.then(function (json: any) {
            if (callback) {
                callback(true);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Get user information of the logged in examiner
     * @param {((success} callback
     * @param {function} json
     */
    public GetUserInformation(callback: ((success: boolean, json: JSON) => void)): void {

        let url = urls.USER_INFO_URL;
        let userInfoPromise = this.makeAJAXCall('GET', url);
        userInfoPromise.then(function (json: any) {
            callback(true, json);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Saving email address
     * @param {ExaminerEmailArgument} examinerEmailArgument
     * @param {((success} callback
     */
    public SaveEmailAddress(examinerEmailArgument: ExaminerEmailArgument, callback: ((success: boolean, json: JSON) => void)): void {

        let url = urls.USER_EMAIL_SAVE_URL;
        let userInfoPromise = this.makeAJAXCall('POST', url, JSON.stringify(examinerEmailArgument));
        userInfoPromise.then(function (json: any) {
            callback(true, null);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * get Immutable
     * @param {userOptionData} data
     * @returns
     */
    private getImmutable(data: userOptionData): userOptionData {
        let immutableList = Immutable.List(data.userOptions);
        data.userOptions = immutableList;
        return data;
    }
}

let userDataService = new UserDataService();
export = userDataService;