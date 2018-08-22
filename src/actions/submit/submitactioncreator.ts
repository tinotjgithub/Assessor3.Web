import dispatcher = require('../../app/dispatcher');
import submitResponseStartedAction = require('./submitresponsestartedaction');
import submitResponseDataService = require('../../dataservices/submit/submitresponsedataservice');
import submitResponseCompletedAction = require('./submitresponsecompletedaction');
import shareAndClassifyCompletedAction = require('./shareandclassifycompletedaction');
import worklistDataService = require('../../dataservices/worklist/worklistdataservice');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');
import enums = require('../../components/utility/enums');
import base = require('../base/actioncreatorbase');
import ShareAndClassifyReturn = require('../../stores/submit/typings/shareAndClassifyReturn');
class SubmitActionCreator extends base {
    /**
     * when clicking on submit button
     * @param markGroupId The mark group id
     */
    public submitResponseStarted(markGroupId: number): void {
        dispatcher.dispatch(new submitResponseStartedAction(markGroupId));
    }

    /**
     * Submit response
     * @param submitResponseArgument
     * @param markSchemeGroupId
     * @param worklistType
     * @param remarkRequestType
     * @param selectedDisplayId
     */
    public submitResponse(submitResponseArgument: SubmitResponseArgument,
        markSchemeGroupId: number,
        worklistType: enums.WorklistType,
        remarkRequestType: enums.RemarkRequestType = enums.RemarkRequestType.Unknown, fromMarkschemepanel: boolean = false,
        selectedDisplayId: string = undefined, examinerRoleIds: Array<number> = null, markSchemeGroupIds: Array<number> = null,
        isStdSetupMode: boolean = false): void {

        let that = this;
        submitResponseDataService.submitResponses(submitResponseArgument, markSchemeGroupId,
            worklistType,
            remarkRequestType, examinerRoleIds, markSchemeGroupIds,
            function (success: boolean, submitResponseReturn?: SubmitResponseReturn) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(submitResponseReturn, true, true)) {

                    if (!success) {
                        submitResponseReturn = undefined;
                    }
                    dispatcher.dispatch(new submitResponseCompletedAction(success, submitResponseReturn,
                        worklistType, fromMarkschemepanel, submitResponseArgument.examinerApproval, submitResponseArgument.markGroupIds,
                        selectedDisplayId, isStdSetupMode));
                }
            });

    }

    /**
     * Share and Classify response
     * @param submitResponseArgument
     * @param fromMarkschemepanel
     * @param selectedDisplayId
     */
    public shareAndClassifyResponse(
        submitResponseArgument: SubmitResponseArgument,
        fromMarkschemepanel: boolean = false,
        selectedDisplayId: string = undefined,
    ): void {

        let that = this;
        submitResponseDataService.ShareAndClassifyResponse(submitResponseArgument,
            function (success: boolean, shareAndClassifyReturn?: ShareAndClassifyReturn) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(shareAndClassifyReturn, true, true)) {

                    if (!success) {
                        shareAndClassifyReturn = undefined;
                    }
                    dispatcher.dispatch(new shareAndClassifyCompletedAction(success, shareAndClassifyReturn,
                        fromMarkschemepanel, selectedDisplayId));
                }
            });
    }
}
let submitActionCreator = new SubmitActionCreator();
/* exporting an instance of SubmitActionCreator */
export = submitActionCreator;