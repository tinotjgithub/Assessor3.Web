import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');

class MarkingCheckDataService extends dataServiceBase {

    /**
     * Makes the ajax call and returns the data
     * @param examinerRoleId
     */
    public getMarkingCheckDetails(
        examinerRoleId: number,
        returnInformationCallback?: Function): void {

        let url = urls.GET_MARKING_CHECK_DETAILS_URL
            .concat('/')
            .concat(examinerRoleId.toString());

        let getMarkingCheckDetailsPromise = this.makeAJAXCall('GET', url);

        getMarkingCheckDetailsPromise.then(function (jsonData: any) {
            if (returnInformationCallback) {
                let result = JSON.parse(jsonData);
                returnInformationCallback(true, result);
            }
        }).catch(function () {
            if (returnInformationCallback) {
            returnInformationCallback(false, undefined);
            }
        });
    }

    /**
     * Makes AJAX call to fetch required recipient list and details
     * @param returnRecipientDataCallback
     */
    public getMarkingCheckRecipients(examinerRoleId: number, returnRecipientsDataCallback?: Function): void {

            let url = urls.GET_MARKING_CHECK_RECIPIENTS_DETAILS_URL
                .concat('/')
                .concat(examinerRoleId.toString());

            let markingCheckRecipientDataPromise = this.makeAJAXCall('GET', url);

            markingCheckRecipientDataPromise.then(function (resultData: any) {
                if (returnRecipientsDataCallback) {
                    returnRecipientsDataCallback(JSON.parse(resultData), true);
                }
            }).catch(function (json: any) {
                if (returnRecipientsDataCallback) {
                    returnRecipientsDataCallback(json, false);
                }
        });
    }

    /**
     * Makes the ajax call and returns merk check examiners data
     * @param msgId
     */
    public getMarkCheckExaminers(
        msgId: number,
        returnInformationCallback?: Function): void {

        let url = urls.GET_MARK_CHECK_EXAMINERS_URL
            + '/' + msgId;

        let getMarkCheckExaminersPromise = this.makeAJAXCall('GET', url);

        getMarkCheckExaminersPromise.then(function (jsonData: any) {
            if (returnInformationCallback) {
                let result = JSON.parse(jsonData);
                returnInformationCallback(true, result);
            }
        }).catch(function () {
            returnInformationCallback(false, undefined);
        });
    }
}

let markingCheckDataService = new MarkingCheckDataService();
export = markingCheckDataService;