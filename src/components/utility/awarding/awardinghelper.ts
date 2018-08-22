import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import enums = require('../enums');
import awardingStore = require('../../../stores/awarding/awardingstore');
import candidateScriptInfo = require('../../../dataservices/script/typings/candidatescriptinfo');
import Immutable = require('immutable');
import localeStore = require('../../../stores/locale/localestore');

class AwardingHelper {

	/**
	 * Method to get the user options for awarding
	 */
    public static getUserOptionData = (filter: enums.AwardingFilters): string => {
        let awardingFilters = userOptionsHelper.getUserOptionByName(userOptionKeys.AWARDING_FILTER_SELECTION);
        if (awardingFilters !== '' && awardingFilters !== undefined) {
            let jsonAwardingFilters = JSON.parse(awardingFilters);
            switch (filter) {
                case enums.AwardingFilters.ExamSessionId:
                    return jsonAwardingFilters.sessionId.toString();
                case enums.AwardingFilters.Grade:
                    return jsonAwardingFilters.grade;
                case enums.AwardingFilters.TotalMark:
                    return jsonAwardingFilters.totalMark;
                case enums.AwardingFilters.GroupByGrade:
                    return jsonAwardingFilters.groupByGrade.toString();
                case enums.AwardingFilters.ComponentId:
                    return jsonAwardingFilters.componentId;
                case enums.AwardingFilters.examProductId:
                    return jsonAwardingFilters.examProductID;
            }
        } else {
            return '';
        }
    };


	/**
	 * Save the awarding filters in user option
	 * @param componentId
	 * @param session
	 * @param grade
	 * @param totalMark
	 * @param groupByGrade
	 */
    public static saveAwardingFilters(componentId: string, sessionId: number, grade: string, totalMark: string, groupByGrade: boolean,
        examProductId: number) {
        let awardingFilters = {
            'componentId': componentId,
            'sessionId': sessionId,
            'grade': grade,
            'totalMark': totalMark,
            'groupByGrade': groupByGrade,
            'examProductID': examProductId
        };

        userOptionsHelper.save(userOptionKeys.AWARDING_FILTER_SELECTION, JSON.stringify(awardingFilters));
    }

    /**
     * returns the selected awarding candidate data
     */
    public static awardingSelectedCandidateData(): any {
        return awardingStore.instance.selectedCandidateData;
    }

    /**
     * Method which returns the collection of candidate script information
     * @param responses
     */
    public static constructCandidateScriptInfo(examSessionId: number): Immutable.List<candidateScriptInfo> {
        let candidateScriptInfoCollection = [];
        let data = awardingStore.instance.awardingCandidateData.filter(x => x.examSessionID === examSessionId).toList();
        data.map((response: AwardingCandidateDetails) => {
            response.responseItemGroups.map((y: ResponseItemGroup) => {
                candidateScriptInfoCollection.push({
                    candidateScriptId: y.candidateScriptId,
                    documentId: y.documentId
                });
            });
        });

        return Immutable.List<candidateScriptInfo>(candidateScriptInfoCollection);
	}

	/**
	 * Get the user defined judgement status name.
	 * @param statusId
	 * @param statusName
	 */
	public static getUserDefinedJudgementStatusName(statusId: number, statusName: string): string {
		let _statusName: string;

		switch (statusId) {
			case enums.JudgementStatus.Status_Disagree:
				_statusName = localeStore.instance.TranslateText('awarding.response-data.status_disagree');
				break;
			case enums.JudgementStatus.Status_Unsure:
				_statusName = localeStore.instance.TranslateText('awarding.response-data.status_unsure');
				break;
			case enums.JudgementStatus.Status_Agree:
				_statusName = localeStore.instance.TranslateText('awarding.response-data.status_agree');
				break;
			default:
				_statusName = statusName;
		}
		return _statusName;
	}
}
export = AwardingHelper;