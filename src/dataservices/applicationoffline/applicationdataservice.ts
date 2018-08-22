import DataServiceBase = require('../base/dataservicebase');
import URLs = require('../base/urls');
declare let config: any;

class ApplicationDataService extends DataServiceBase {

   /**
    * Ping server to check application has open network
    * @param {((success} callback
    * @param {function} json?
    */
    public ping(callback: ((success: boolean, json?: any) => void)): void {
        let pingPromise = this.makeAJAXCall('GET', URLs.PING_URL, '', false, false);
        pingPromise.then(function (json: any) {
            if (callback) {
                callback(true, json);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * To download modules
     * @param modules
     */
    public downloadModules(modules: Array<string>): Promise<any> {

        let that = this;
        return new Promise(function (resolve: any, reject: any) {
            let jsonUrl = './build/generated/3.' + config.general.WEBPACK_HASH + '.bundle.js';
            for (let i = 0; i < modules.length; i++) {
                that.makeAJAXCallWithFullUrl('GET', jsonUrl);
            }
            resolve();
        });
    }
}
let applicationDataService = new ApplicationDataService();

export = applicationDataService;