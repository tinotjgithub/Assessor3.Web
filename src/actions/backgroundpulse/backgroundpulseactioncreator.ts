import dispatcher = require('../../app/dispatcher');
import backgroundPulseAction = require('./backgroundpulseaction');
import backgroundPulseDataService = require('../../dataservices/backgroundpulse/backgroundpulsedataservice');
import backgroundPulseArgument = require('../../dataservices/backgroundpulse/backgroundpulseargument');
import actionCreatorBase = require('../base/actioncreatorbase');


/**
 * Background pulse action creator helper class
 */
class BackgroundPulseActionCreator extends actionCreatorBase {
    /**
     * Call the background pulse service and then generate an appropriate notification action
     */
    public handleBackgroundPulse(args: backgroundPulseArgument): void {

        let that = this;

        backgroundPulseDataService.handleBackgroundPulse(args, function (success: boolean, backgroundPulseReturnData?: any) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(backgroundPulseReturnData)) {

                // Dispatch the background pulse action
                dispatcher.dispatch(new backgroundPulseAction(success, backgroundPulseReturnData));
            }
        });
    }
}

let backgroundPulseActionCreator = new BackgroundPulseActionCreator();
export = backgroundPulseActionCreator;