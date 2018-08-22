import dispatcher = require('../../app/dispatcher');
import autoApprovalMessageAction = require('./autoapprovalmessageaction');
import autoApprovalMessageDataService = require('../../dataservices/autoapproval/autoapprovalmessagedataservice');
import base = require('../base/actioncreatorbase');
/**
 * Auto approval message status update action creator class
 */
class AutoApprovalMessageActionCreator extends base {
    /**
     * Call the Auto approval message status update service and then generate an appropriate action
     */
    public UpdateAutoApprovalMessageState(markSchemeGroupID: number): void {

        let that = this;
        autoApprovalMessageDataService.UpdateAutoApprovalMessageState(markSchemeGroupID, function (success: boolean, json?: any) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json)) {
                dispatcher.dispatch(new autoApprovalMessageAction(success));
            }
        });
    }
}

let autoApprovalMessageActionCreator = new AutoApprovalMessageActionCreator();
export = autoApprovalMessageActionCreator;