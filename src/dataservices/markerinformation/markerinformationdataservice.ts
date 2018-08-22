import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import markerInformation = require('../../stores/markerinformation/typings/markerinformation');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import enums = require('../../components/utility/enums');
declare let config: any;

/**
 *  Marker information data service
 * @param {((success} callback
 * @param {function} json
 */
class MarkerInformationDataService extends dataServiceBase {

    /**
     * Determines whether to retrieve data from cache or needs a service call and returns the data.
     * @param {((success} callback
     * @param {function} json
     */
    public GetMarkerInformation(
        examinerRoleID: number,
        markSchemeGroupId: number,
        callback: ((success: boolean, markerInfo: markerInformation, isResultFromCache: boolean) => void),
        useCache: boolean, currentApprovalStatus: enums.ExaminerApproval): void {

        let that = this;

        if (useCache) {

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('marker',
                'markerInformation_' + examinerRoleID,
                true,
                0);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value, true);
                }
            }).catch(function (jsonResult: any) {
                that.GetMarkerInformationOnline(examinerRoleID, markSchemeGroupId, callback);
            });
        } else {
            this.GetMarkerInformationOnline(examinerRoleID, markSchemeGroupId, callback);
        }
    }

    /**
     * Get profile information of the logged in examiner.
     */
    private GetMarkerInformationOnline(examinerRoleID: number, markSchemeGroupId: number, callback: Function) {

        let url = urls.MARKER_INFO_URL
            .concat('/')
            .concat(examinerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString());
        let userInfoPromise = this.makeAJAXCall('GET', url);
        let that = this;

        userInfoPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('marker', 'markerInformation_' + examinerRoleID,
                json, true).then().catch();

            callback(true, json, false);
        }).catch(function (json: any) {
            callback(false, undefined, false);
        });
    }
}

let markerInformationDataService = new MarkerInformationDataService();
export = markerInformationDataService;