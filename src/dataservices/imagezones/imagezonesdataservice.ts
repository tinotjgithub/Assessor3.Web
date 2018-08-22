import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;
import Immutable = require('immutable');

/**
 * Class for Getting image zone details
 */
class ImagezonesDataService extends dataServiceBase {

    /**
     * Get the imagezone details.
     * @param {((success} callback
     * @param {function} json
     * @param questionPaperId
     * @param useCache
     */
    public getImageZoneDetails(callback: ((success: boolean, json: ImageZoneList) => void),
        questionPaperId: number,
        markSchemeGroupId: number,
        useCache: boolean): void {
        let that = this;

        if (useCache) {

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('imagezone',
                'imagezonelist_' + questionPaperId,
                true,
                config.
                    cacheconfig.THIRTY_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                that.getImageZoneDetailOnline(questionPaperId, markSchemeGroupId, callback);
            });
        } else {
            this.getImageZoneDetailOnline(questionPaperId, markSchemeGroupId, callback);
        }
    }

    /**
     * Call Api to get the data
     * @param {number} questionPaperId
     * @param callback?
     */
    private getImageZoneDetailOnline(questionPaperId: number, markSchemeGroupId: number, callback?: Function): void {
        let url = urls.IMAGE_ZONE_GET_URL + '/' + questionPaperId + '/' + markSchemeGroupId;

        let getImageZoneListPromise = this.makeAJAXCall('GET', url);
        let that = this;
        getImageZoneListPromise.then(function (jsonData: any) {

            if (callback) {
                let resultData = that.parseJsonResult(jsonData);
                storageAdapterFactory.getInstance().storeData('imagezone', 'imagezonelist_' + questionPaperId, resultData, true)
                    .then()
                    .catch();
                callback(resultData.success, resultData);
            }
        }).catch(function (jsonData: any) {

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
    private parseJsonResult(json: string): ImageZoneList {

        let result: ImageZoneList;
        result = JSON.parse(json);
        result.imageZones = Immutable.List<ImageZone>(JSON.parse(json).imageZones);
        return result;
    }
}

let imagezonesDataService = new ImagezonesDataService();
export = imagezonesDataService;
