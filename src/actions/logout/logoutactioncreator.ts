import dispatcher = require('../../app/dispatcher');
import logoutArgument = require('../../dataservices/authentication/logoutargument');
import logoutAction = require('./logoutaction');
import authenticationDataService = require('../../dataservices/authentication/authenticationdataservice');
import enums = require('../../components/utility/enums');
import responseStore = require('../../stores/response/responsestore');
import marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
import base = require('../base/actioncreatorbase');
import userInfoStore = require('../../stores/userinfo/userinfostore');

/**
 * Logout action creator helper class
 */
class LogoutActionCreator extends base {
    /**
     * Update user session data
     * @param logoutData
     */
    public updateUserSession(logoutData: logoutArgument): void {

        let that = this;
        logoutData.isReportsPageAccessed = userInfoStore.instance.isReportsPageSelected;
        marksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Logout,
            () => {
            //needs to be save the pending items in the save marks and annotations queue.
                authenticationDataService.updateUserSession(logoutData, function (success: boolean, json?: any) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(json, false, true, enums.WarningMessageAction.None, true)) {
                        dispatcher.dispatch(new logoutAction(success, json));
                    }
            });
        });
    }
}

let logoutActionCreator = new LogoutActionCreator();
export = logoutActionCreator;