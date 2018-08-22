import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import Promise = require('es6-promise');
import ActionCreatorBase = require('../base/actioncreatorbase');
import awardingIndicatorAction = require('./awardingindicatoraction');
import awardingDataService = require('../../dataservices/awarding/awardingdataservice');
import awardingComponentSelectAction = require('./awardingcomponentselectaction');
import componentAndSessionGetAction = require('./componentandsessiongetaction');
import awardingCandidateDetailsGetAction = require('./awardingcandidatedetailsgetaction');
import updateFilterforCandidateDataSelectAction = require('./updateFilterforCandidateDataSelectAction');
import setSelectedCandidateDataAction = require('./setselectedcandidatedataaction');
import awardingJudgementStatusGetAction = require('./awardingjudgementstatusgetaction');
import selectAwardingJudgementStatusAction = require('./selectawardingjudgementstatusaction');

/**
 * Awarding action creator
 */
class AwardingActionCreator extends ActionCreatorBase {

    /**
     *  Gets the Awarding aceess details for showing the notification indicator
     */
    public getAwardingAccessDetails(): void {
        let that = this;
        awardingDataService.getAwardingAccessDetails(function (succcess, awardingAccessDetails: AwardingAccessDetails) {
            if (that.validateCall(awardingAccessDetails, false, true)) {
                if (!succcess) {
                    awardingAccessDetails = undefined;
                }
            }
            dispatcher.dispatch(new awardingIndicatorAction(succcess, awardingAccessDetails));
        });
    }

    /**
     * Dispatching the awarding component select option on selecting a component
     * @param componentId the id of selected component
     */
	public selectAwardingComponent(examProductId: string, componentId: string, assessmentCode: string, viaUserOption: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
		}).then(() => {
			dispatcher.dispatch(new awardingComponentSelectAction(componentId, examProductId, assessmentCode, viaUserOption));
        }).catch();
    }

    /**
     *  Dispatching the action with component and session details for awarding
     */
    public getAwardingComponentAndSessionDetails(): void {
        let that = this;
        awardingDataService.getComponentAndSessionDetails(function (succcess, data: AwardingComponentsAndSessionList) {
            if (that.validateCall(data, false, true)) {
                if (!succcess) {
                    data = undefined;
                }
            }
            dispatcher.dispatch(new componentAndSessionGetAction(succcess, data));
        });
    }
    /**
     *  Dispatching the action with candidate details for the exam session
     */
    public getAwardingCandidateDetails(examSessionId: number): void {
        let that = this;
        awardingDataService.getAwardingCandidateDetails(function (succcess, data: AwardingCandidateDetailsList) {
            if (that.validateCall(data, false, true)) {
                if (!succcess) {
                    data = undefined;
                }
            }
            dispatcher.dispatch(new awardingCandidateDetailsGetAction(succcess, data, examSessionId));
        }, examSessionId);
    }

    /**
     * Dispatching the awarding component select option on selecting a component
     * @param componentId the id of selected component
     */
    public updateFilterforCandidateData(selectedGrade: string, selectedTotalMark: string, orderByGrade: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateFilterforCandidateDataSelectAction(selectedGrade, selectedTotalMark, orderByGrade));
        }).catch();
    }

    /**
     * dispatching to set the selected candidate data
     * @param awardingCandidateId
     */
    public setSelectedCandidateData(awardingCandidateId: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setSelectedCandidateDataAction(awardingCandidateId));
        }).catch();
    }

	/**
	 * Get the Awarding Judgement Status
	 */
    public getAwardingJudgementStatus(examSessionId: number) {
        let that = this;
        awardingDataService.getAwardingJudgementStatus(examSessionId, function(success, data: AwardingJudgementStatusList) {
            if (that.validateCall(data, false, true)) {
                if (!success) {
                    data = undefined;
                }
            }
            dispatcher.dispatch(new awardingJudgementStatusGetAction(success, data));
        });
    }

	/**
	 * Select the specified judgement status 
	 * @param judgementStatus
	 */
    public selectAwardingJudgementStatus(judgementStatus: AwardingJudgementStatus, awardingCandidateID: number): void {
        let that = this;

        let awardingJudgementSaveData: AwardingJudgementSaveData = {
            awardingJudgementStatusID: judgementStatus.awardingJudgementID === -1 ? null : judgementStatus.awardingJudgementID,
            awardingCandidateID : awardingCandidateID
        };

        awardingDataService.saveAwardingJudgementStatus(awardingJudgementSaveData,
            function (succes: boolean, totalJudgementCount: number) {
                if (that.validateCall(totalJudgementCount, false, true)) {
                    if (!succes) {
                        totalJudgementCount = undefined;
                    }
                }
                dispatcher.dispatch(new selectAwardingJudgementStatusAction(succes, judgementStatus, totalJudgementCount));
            });
    }
}

let awardingActionCreator = new AwardingActionCreator();
export = awardingActionCreator;
