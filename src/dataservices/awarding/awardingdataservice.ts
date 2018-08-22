import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');

/**
 *  initiate the Awarding API call and returns the awarding access details along with callback.
 * @param callback
 */
class AwardingDataService extends dataServiceBase {

    /**
     * Ajax call for saving the awarding judgement details
     * @param awardingJudgementSaveData
     * @param callback
     */
    public saveAwardingJudgementStatus(awardingJudgementSaveData: AwardingJudgementSaveData,
                                       callback: (success: boolean, json: any) => void): void {

        let url = urls.AWARDING_JUDGEMENT_SAVE;
        let awardingJudgementSave = this.makeAJAXCall('POST', url, JSON.stringify(awardingJudgementSaveData));

        awardingJudgementSave.then(function (totalJudgementCount: number) {
            callback(true, totalJudgementCount);
        }).catch(function (data: any) {
            callback(false, undefined);
        });
    }

    /**
     * Ajax call for getting the awarding access details
     * @param callback
     */
    public getAwardingAccessDetails(
        callback: ((successs: boolean, json: AwardingAccessDetails) => void)): void {
        let url = urls.GET_AWARDING_ACCESS_DETAILS;
        let getAwardingAccessDetails = this.makeAJAXCall('GET', url);
        getAwardingAccessDetails.then(function (json: any) {
            let result: AwardingAccessDetails;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Ajax call for getting the awarding access details
     * @param callback
     */
    public getComponentAndSessionDetails(
        callback: ((successs: boolean, json: AwardingComponentsAndSessionList) => void)): void {
        let url = urls.GET_AWARDING_COMPONENT_SESSION_DETAILS;
        let componentDetailsPromise = this.makeAJAXCall('GET', url);
        componentDetailsPromise.then(function (json: any) {
            let result: AwardingComponentsAndSessionList;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Ajax call for getting the awarding candidate details for selected exam session
     * @param callback
     * @param examSessionID
     */
    public getAwardingCandidateDetails(
        callback: ((successs: boolean, json: AwardingCandidateDetailsList) => void),
        examSessionID : number): void {
        let url = urls.GET_AWARDING_CANDIDATE_DETAILS + '/' + examSessionID ;
        let awardingcandidateDetailsPromise = this.makeAJAXCall('GET', url);
        awardingcandidateDetailsPromise.then(function (json: any) {
            let result: AwardingCandidateDetailsList;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

	/**
	 * Ajax call for get the awarding judgement status.
	 * @param callback
	 */
    public getAwardingJudgementStatus(examSessionId : number,
        callback: ((successs: boolean, json: AwardingJudgementStatusList) => void)): void {
        let url = urls.GET_AWARDING_JUDGEMENT_STATUS + '/' + examSessionId;
        let awardingJudgementStatusPromise = this.makeAJAXCall('GET', url);
        awardingJudgementStatusPromise.then(function(json: any) {
            let result: AwardingJudgementStatusList;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function(json: any) {
            callback(false, undefined);
        });
    }
}

let awardingDataService = new AwardingDataService();
export = awardingDataService;