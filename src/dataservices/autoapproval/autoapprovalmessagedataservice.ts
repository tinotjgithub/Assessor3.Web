import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');

class AutoApprovalMessageDataService extends dataServiceBase {

   /**
    * Call the Auto approval message status update data service.
    * @param markSchemeGroupID - mark Scheme Group ID.
    * @param callback - call back with success boolean.
    */
    public UpdateAutoApprovalMessageState(markSchemeGroupID: number,
        callback: ((success: boolean, data?: any) => void)): void {

        let url = urls.AUTO_APPROVAL_MESSAGE_STATUS_UPDATE_URL;

        /**  Making AJAX call to update the message status as read */
        let updateAutoApprovalMessagePromise = this.makeAJAXCall('POST', url, JSON.stringify(markSchemeGroupID));
        updateAutoApprovalMessagePromise.then(function (data: any) {
            if (callback) {
                callback(true);
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, data);
            }
        });
    }
}

let autoApprovalMessageDataService = new AutoApprovalMessageDataService();

export = autoApprovalMessageDataService;