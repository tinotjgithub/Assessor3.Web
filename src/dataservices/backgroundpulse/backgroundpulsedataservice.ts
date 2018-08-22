import dataServiceBase = require('../base/dataservicebase');
import backgroundPulseArgument = require('./backgroundpulseargument');
import backgroundPulseReturn = require('../../stores/backgroundpulse/typings/backgroundpulsereturn');
import urls = require('../base/urls');

class BackgroundPulseDataService extends dataServiceBase {

   /**
    * Call the Background Pulse data service.
    * Updates the logged in pulse.
    * Returns number of notification.
    * @param args - data that has to be passed as a parameter to the background pulse argument.
    * @param callback - call back with success boolean and Background pulse info object.
    */
    public handleBackgroundPulse(args: backgroundPulseArgument,
                                 callback: ((success: boolean, notificationData: backgroundPulseReturn) => void)): void {

        let url = urls.NOTIFICATION_URL;

		/**  Making AJAX call to update logged in pulse and get the the pending notifications */
        let backgroundPulsePromise = this.makeAJAXCall('POST', url, JSON.stringify(args));
        backgroundPulsePromise.then(function (data: any) {
                if (callback) {
                    callback(true, JSON.parse(data));
                }
        }).catch(function (data: any) {
            if (callback) {
                    callback(false, data);
                }
            });
    }
}

let backgroundPulseDataService = new BackgroundPulseDataService();

export = backgroundPulseDataService;