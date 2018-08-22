import base = require('../base/actioncreatorbase');
import promise = require('es6-promise');
import markingCheckDataService = require('../../dataservices/markingcheck/markingcheckdataservice');
import dispatcher = require('../../app/dispatcher');
import markingCheckInfoFetchAction = require('./markingcheckinformationfetchaction');
import markingCheckRecipientsFetchAction = require('./markingcheckrecipientsfetchaction');
import getMarkCheckExaminersAction = require('./getmarkcheckexaminersaction');
import enums = require('../../components/utility/enums');
import toggleRequestMarkingCheckButtonAction = require('./togglerequestmarkingcheckbuttonaction');
import toggleMarkingCheckModeAction = require('./togglemarkingcheckmodeaction');
/**
 * Marking Check Action Creator for all marking check actions
 */
class MarkingCheckActionCreator extends base {

    /**
     * Gets marking check data for the marker
     * @param doRequireMarkingCheckInfo
     * @param examiner_role_id
     */
    public getMarkingCheckInfo(doRequireMarkingCheckInfo: boolean, examinerRoleId: number) {

        let that = this;
        if (doRequireMarkingCheckInfo) {
            markingCheckDataService.getMarkingCheckDetails(
                examinerRoleId,
                function (success: boolean, resultData: MarkingCheckInformation) {
                    if (that.validateCall(resultData)) {
                        dispatcher.dispatch(new markingCheckInfoFetchAction(resultData, success));
                    }
                });
        }
    }

    /**
     * Gets the list of eligible markers and details to whom marking check can be requested
     */
    public getMarkingCheckRecipients(examinerRoleId: number) {
        let that = this;
        markingCheckDataService.getMarkingCheckRecipients(examinerRoleId,
            function (result: Array<MarkingCheckRecipient>, success: boolean) {
                if (that.validateCall(result, false, true)) {
                    if (!success) {
                        result = undefined;
                    }
                } else {
                    result = undefined;
                }
                dispatcher.dispatch(new markingCheckRecipientsFetchAction(result, success));
            });
    }

    /**
     * Gets mark check examiners data
     * @param msgId
     */
    public getMarkCheckExaminers(msgId: number) {

        let that = this;
            markingCheckDataService.getMarkCheckExaminers(
                msgId,
                function (success: boolean, markCheckExaminersData: any) {
                    if (that.validateCall(markCheckExaminersData)) {
                        dispatcher.dispatch(new getMarkCheckExaminersAction(success, markCheckExaminersData));
                    }
                });
    }

    /**
     * toggling request marking check button
     */
    public toggleRequestMarkingCheckButton(doDisable: boolean = false) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new toggleRequestMarkingCheckButtonAction(doDisable));
        }).catch();
    }

    /**
     * toggling marking check mode
     */
    public toggleMarkingCheckMode(markingCheckModeValue: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new toggleMarkingCheckModeAction(markingCheckModeValue));
        }).catch();
    }

}

let markingCheckActionCreator = new MarkingCheckActionCreator();
export = markingCheckActionCreator;