import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;
import Immutable = require('immutable');
import stampData = require('../../stores/stamp/typings/stampdata');
import stampList = require('../../stores/stamp/typings/stamplist');
import enums = require('../../components/utility/enums');
import stampdataAgainstQig = require('../../stores/stamp/typings/stampdataagainstqig');

class StampDataService extends dataServiceBase {
    /**
     * This method will load the defined stamps for the selected QIG
     * @param callback - callback function
     * @param markSchemeGroupId - selected markschemegroupId
     * @param stampIds - The stamp details already in store need not be fetched again from DB.
     * @param useCache - boolean field to decide whether we need to use cache or not
     */
    public getStampList(callback: ((success: boolean, json: any) => void),
        markSchemeGroupId: number,
        stampIds: Immutable.List<number>,
        markingMethod: enums.MarkingMethod,
        includeRelatedQigs: boolean,
        useCache: boolean,
		isEbookmarking: boolean,
		includeRelatedQPs: boolean = false): void {

            let that = this;

            if (useCache) {
                // Returns the Promise object for in-memory storage adapter.
                let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('stamp',
                    'stamplist_' + markSchemeGroupId,
                    true,
                    config.
                    cacheconfig.THIRTY_MINUTES_CACHE_TIME);

                inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                    // If retrieve from memory then simply invoke the callback
                    if (callback) {
                        callback(true, jsonResult.value);
                    }
                }).catch(function (jsonResult: any) {
                    // If not found in memory, invoke the call to the server to retrieve stamp data.
					that.makeAJAXCallForStampData(true, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs,
						isEbookmarking, includeRelatedQPs, callback);
                });
            } else {
                // If we don't need to use cache, then stamp data will be directly fetch from server.
                this.makeAJAXCallForStampData(true, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs,
                    isEbookmarking, includeRelatedQPs, callback);
            }
    }

    /**
     * This will make a ajax call for loading stamp data.
     * @param markSchemeGroupId - selected markschemegroupId
     * @param stampIds - available stamp Ids
     * @param callback - callback function
     */

    private makeAJAXCallForStampData(doCacheData: boolean,
        markSchemeGroupId: number,
        stampIds: any,
        markingMethod: enums.MarkingMethod,
        includeRelatedQigs: boolean,
		isEbookmarking: boolean,
		includeRelatedQPs: boolean,
        callback?: Function) {
        let url = urls.STAMPS_GET_URL;
        let arg = JSON.stringify({
            MarkSchemeGroupId: markSchemeGroupId, StampIds: stampIds,
            MarkingMethod: markingMethod, IncludeRelatedQigs: includeRelatedQigs,
			IsEbookMarking: isEbookmarking, IncludeRelatedQPs: includeRelatedQPs
        });
        // Returns the promise object for the Ajax call
        let getStampListPromise = this.makeAJAXCall('POST', url, arg);
        let that = this;
        getStampListPromise.then(function (jsonData: any) {

            if (callback) {
                let resultData = that.getImmutableListObject(JSON.parse(jsonData));
                // If data to be cached, then store it in in-memory storage adapter.
                if (doCacheData) {
                    // we don't need to keep stamps in in-memory storage because we are storing the entire stamps in store variable.
                    let dataToStore: stampList = that.getImmutableListObject(JSON.parse(jsonData));
                    dataToStore.stampDataAgainstQig.forEach((item: any) => {
                        item.stamps = null;
                        storageAdapterFactory.getInstance().storeData('stamp', 'stamplist_' + markSchemeGroupId, dataToStore, true)
                            .then()
                            .catch();
                    });
                }
                // If callback exists, invoke the same
                if (callback) {
                    callback(resultData.success, resultData);
                }
            }
        }).catch(function (jsonData: any) {

            // If callback exists, invoke the same with success value as false since Ajax call failed.
            if (callback) {
                callback(false, jsonData);
            }
        });
    }

    /**
     * Map the result JSON to the object.
     * @param {string} json
     * @returns The mapped result
     */
    private getImmutableListObject(data: stampList): stampList {
        data.stampDataAgainstQig.forEach((item: stampdataAgainstQig) => {
            item.stamps = Immutable.List<stampData>(item.stamps);
            item.markSchemGroupStampIds = Immutable.List<number>(item.markSchemGroupStampIds);
        });

        return data;
    }

}

let stampDataService = new StampDataService();
export = stampDataService;