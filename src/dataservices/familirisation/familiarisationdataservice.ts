import dataServiceBase = require('../base/dataservicebase');
import URLs = require('../base/urls');

/**
 * Familiarisation data service class
 */
class FamiliarisationDataService extends dataServiceBase {

    /**
     * setUp Familiarisation Data
     * @param callback
     */
    public setUpFamilarisationData(
        callback: ((success: boolean, isFamComponentsCreated: boolean, json?: any) => void)): void {
        let url = URLs.CREATE_FAMILARISATION_DATA;

        // Making AJAX call for setting up the Familiarisation data
        let authenticationPromise = this.makeAJAXCall(
            'POST',
            url);

        authenticationPromise.then(function (json: any) {
            if (callback) {
                callback(true, true);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, false, json);
            }
        });
    }
}

let familiarisationDataService = new FamiliarisationDataService();

export = familiarisationDataService;