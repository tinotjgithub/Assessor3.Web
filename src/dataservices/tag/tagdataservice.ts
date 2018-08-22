import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');

class TagDataService extends dataServiceBase {

    /**
     * initiate the tags API call and returns the tags along with callback.
     * @param callback
     */
    public getTags(callback: ((success: boolean, json: TagData) => void)): void {

        let url = urls.GET_TAG_DATA;
        let getTagsPromise = this.makeAJAXCall('GET', url);
        getTagsPromise.then(function (json: any) {
            let result: TagData;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * ajax calls to Tag Update and delete
     * @param updateResponseTagArguments
     * @param callback
     */
    public updateTags(updateResponseTagArguments: UpdateResponseTagArguments,
        callback: ((success: boolean, json: TagUpdateReturn) => void)) {

        let url = urls.UPDATE_TAG_DATA;
        let updateResponseTagJSON = JSON.stringify(updateResponseTagArguments);
        let updateTagsPromise = this.makeAJAXCall('POST', url, updateResponseTagJSON, true, true);
        updateTagsPromise.then(function (data: any) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, data);
            }
        });
    }
}

let tagDataService = new TagDataService();
export = tagDataService;

