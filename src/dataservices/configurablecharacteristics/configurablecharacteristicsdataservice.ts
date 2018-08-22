import dataServiceBase = require('../base/dataservicebase');
import URLs = require('../base/urls');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;
import configurableCharacteristicsData = require('../../stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import Immutable = require('immutable');


class ConfigurableCharacteristicsDataService extends dataServiceBase {

    /**
     * get immutable
     * @param data
     */
    private getImmutable(data: configurableCharacteristicsData): configurableCharacteristicsData {
        let immutableList = Immutable.List(data.configurableCharacteristics);
        data.configurableCharacteristics = immutableList;
        return data;
    }

   /**
    * Determines whether to retrieve data from cache or needs a service call and returns the data.
    * @param callback - call back with success boolean and JSON object corresponding to Exam Body CCs.
    */
    public getExamBodyCCs(callback: ((success: boolean, ccData: configurableCharacteristicsData) => void),
                                        useCache: boolean = false): void {

        let that = this;

        if (useCache) {

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('exambody',
                'configcharacteristics',
                true,
                0);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                that.getExamBodyCCsFromServer(callback);
            });
        } else {
            this.getExamBodyCCsFromServer(callback);
        }
    }

   /**
    * Call the Configurable Characteristics data service and returns JSON object Exam body CCs.
    * @param callback - call back with success boolean and JSON object corresponding to Exam Body CCs.
    */
    private getExamBodyCCsFromServer(callback: Function) {
        let url = URLs.EXAM_BODY_CC_URL;

        /**  Making AJAX call to get the locale JSON */
        let localePromise = this.makeAJAXCall('GET', url);
        localePromise.then(function (json: any) {
            if (callback) {

                storageAdapterFactory.getInstance().storeData('exambody', 'configcharacteristics',
                    JSON.parse(json), true).then().catch();

                callback(true, JSON.parse(json));
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

   /**
    * Call the Configurable Characteristics data service and returns JSON object Exam body CCs.
    * @param callback - call back with success boolean and JSON object corresponding to Exam Body CCs.
    */
    public getMarkSchemeGroupCCs(markSchemeGroupId: number,
                                 questionPaperId: number,
                                 callback: ((success: boolean, ccData: configurableCharacteristicsData) => void)): void {

		// Trying to retrieve from In memory storage - default cache time for QIG Level CCs is 30 minutes
        let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('configurablecharacteristic',
                                                                                'markschemegroupccforqp_' + questionPaperId,
                                                                                 true,
                                                                                 config.
                                                                                 cacheconfig.THIRTY_MINUTES_CACHE_TIME);
        let configurableCharacteristics: configurableCharacteristicsData;
        let that = this;

		// OnSuccess of promise
        inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
            callback(true, jsonResult.value);
        }).catch(function (jsonResult: any) {

			// OnFailure of promise, invoking the AJAX request to get the QIG Level CCs
            let url = URLs.MARK_SCHEME_GROUP_CC_URL;
            let getMarkSchemeGroupCCPromise = that.makeAJAXCall('GET', url + '/' + markSchemeGroupId);

			// OnSuccess of promise, storing the CC data to in memory storage and then invoking the callback
            getMarkSchemeGroupCCPromise.then(function (result: any) {
                configurableCharacteristics = that.getImmutable(JSON.parse(result));
                if (callback) {
                    storageAdapterFactory.getInstance().storeData('configurablecharacteristic',
                        'markschemegroupccforqp_' + questionPaperId,
                        configurableCharacteristics,
                        true).then(function () {
                            callback(true, configurableCharacteristics);
                    }).catch();
                }
            }).catch(function (result: any) {
                if (callback) {
                    callback(false, result);
                }
            });
        });
    }
}

let configurableCharacteristicsDataService = new ConfigurableCharacteristicsDataService();
export = configurableCharacteristicsDataService;