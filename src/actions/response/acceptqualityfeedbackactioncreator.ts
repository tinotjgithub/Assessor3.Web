
import dispatcher = require('../../app/dispatcher');
import responseDataService = require('../../dataservices/response/responsedataservice');
import enums = require('../../components/utility/enums');
import acceptQualityFeedbackAction = require('./acceptqualityfeedbackaction');
import acceptQualityFeedbackArguments = require('../../dataservices/response/acceptqualityfeedbackarguments');
import acceptQualityFeedbackReturn = require('../../stores/response/typings/acceptqualityfeedbackreturn');

class AcceptQualityFeedbackActionCreator {

    /**
     * Performs the accept quality feedback operation
     * @param markGroupId
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param navigateTo
     * @param navigateWorkListType
     */
       public acceptQualityFeedback(markGroupId: number,
        examinerRoleId: number,
        markSchemeGroupId: number,
        navigateTo: enums.SaveAndNavigate, navigateWorkListType: enums.WorklistType): void {

        let args = new acceptQualityFeedbackArguments(markGroupId, markSchemeGroupId, examinerRoleId);
        responseDataService.acceptQualityFeedback(args, function (data: acceptQualityFeedbackReturn, success: boolean) {
            dispatcher.dispatch(new acceptQualityFeedbackAction(data, success, navigateTo, navigateWorkListType));
        });
    }
}
let acceptQualityFeedbackActionCreator = new AcceptQualityFeedbackActionCreator();
export = acceptQualityFeedbackActionCreator;