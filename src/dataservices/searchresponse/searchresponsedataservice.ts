import urls = require('../base/urls');
import dataServiceBase = require('../base/dataservicebase');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;

/**
 * SearchResponse data service class
 */
class SearchResponseDataService extends dataServiceBase {

    /**
     * get SearchResponseDetails from Cache
     * 
     * @param markSchemeGroupId 
     * @param examinerRoleId
     * @param displayId
     * @param callback 
     */

    public getSearchResponseDetail(markSchemeGroupId: number, examinerRoleId: number,
        displayId: number,
        callback: ((success: boolean, searchedResponseData: any, isResultFromCache: boolean) => void)): void {

        let url = urls.SEARCH_RESPONSE_DETAIL + '/' + markSchemeGroupId + '/' + examinerRoleId + '/' + displayId;
        let getsearchResponsePromise = this.makeAJAXCall('GET', url);
        getsearchResponsePromise.then(function (json: any) {
            callback(true, JSON.parse(json), false);
        }).catch(function (json: any) {
            callback(false, json, false);
        });

    }
}

let searchresponsedataservice = new SearchResponseDataService();
export = searchresponsedataservice;