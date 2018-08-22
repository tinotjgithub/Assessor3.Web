import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import actionInterruptedAction = require('./actoninterruptedaction');
import downloadapplicationmoduleaction = require('./downloadapplicationmoduleaction');

class ApplicationActionCreator extends base {

    /**
     * This will update the online status of the browser.
     * check whether the browser is connected to a internet/network or not.
     * @param onlineStatus
     */
    public updateOnlineStatus() {
        this.invokeOnlineStatusUpdate(false);
    }

    /**
     * Check whether the call was interrupted due to network failure
     * @returns whether action interrupted or not
     */
    public checkActionInterrupted(): boolean {

        if (this.isOnline) {
            return true;
        }

        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new actionInterruptedAction());
        });

        return false;
    }

    /**
     * Download the bundles when coming online
     * @param {Array<string>} modules
     */
    public downloadModlules(modules: Array<string>): void {
        this.serviceInstance.downloadModules(modules).then(function () {
            dispatcher.dispatch(new downloadapplicationmoduleaction(''));
        });
    }

    /**
     * queue application module to preseve the name to download when application
     * comes online.
     * @param {string} moduleName
     */
    public enqueApplicationModuleDownload(moduleName: string): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new downloadapplicationmoduleaction(moduleName));
        });
    }
}

let applicationActionCreator = new ApplicationActionCreator();
export = applicationActionCreator;