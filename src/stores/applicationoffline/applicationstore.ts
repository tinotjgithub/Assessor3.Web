import dispatcher = require('../../app/dispatcher');
import storeBase = require('../base/storebase');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import applicationStatusAction = require('../../actions/applicationoffline/browseronlinestatusupdationaction');
import actionInterruptedAction = require('../../actions/applicationoffline/actoninterruptedaction');
import downloadapplicationmoduleaction = require('../../actions/applicationoffline/downloadapplicationmoduleaction');

class ApplicationStore extends storeBase {

    private _isApplicationOnline: boolean = true;
    private _isApplicationOnlineCurrently: boolean = true;
    private _isApplicationOnlinePreviously: boolean = true;
    private _elapsedTime: number = undefined;
    private _allowNavigation: boolean = false;

    private _modulesToDownload: Array<string> = [];
    // Online status updated event .
    public static ONLINE_STATUS_UPDATED_EVENT = 'onlinestatusupdated';

    // Event name for distributing action has been interruptedny connection issues
    public static ACTION_INTERRUPTED_EVENT = 'actioninterruptedaction';

    // download response module
    public static RESPONSE_MODULE = 'responsemodule';

    /**
     * @constructor
     */
    constructor() {
        super();

        this.dispatchToken = dispatcher.register((action: action) => {

            switch (action.actionType) {
                case actionType.UPDATE_BROWSER_ONLINE_STATUS:
                    let applicationStatusAction = action as applicationStatusAction;
                    let _isOnline: boolean = applicationStatusAction.isOnline;
                    // Avoiding duplicate emit.
                    if (this._isApplicationOnline !== _isOnline || applicationStatusAction.forceEmit) {
                        this._isApplicationOnline = _isOnline;

                        this.emit(ApplicationStore.ONLINE_STATUS_UPDATED_EVENT);
                    }

                    if (this._isApplicationOnline) {
                        this._isApplicationOnlineCurrently = true;
                    } else if (!this._isApplicationOnline && this._isApplicationOnlineCurrently) {
                        // Updating the elapsed time, only when the application status switches from Online to offline.
                        this._elapsedTime = Date.now();
                        this._isApplicationOnlineCurrently = false;
                    }
                    break;
                case actionType.ACTION_INTERRUPTED_ACTION:
                    this._allowNavigation = (action as actionInterruptedAction).allowNavigation;
                    this.emit(ApplicationStore.ACTION_INTERRUPTED_EVENT, (action as actionInterruptedAction).isFromLogout);
                    break;
                case actionType.DOWNLOAD_APPLICATION_MODULE_ACTION:

                    // clear the download collection as its completed download
                    if ((action as downloadapplicationmoduleaction).moduleName === '') {
                        this._modulesToDownload = [];
                    } else {
                        this._modulesToDownload.push((action as downloadapplicationmoduleaction).moduleName);
                    }
                    break;
            }
        });
    }

    /**
     * Gets a value indicating whether the application was online or offline previously.
     * @returns
     */
    public get isApplicationOnlinePreviously(): boolean {
        return this._isApplicationOnlinePreviously;
    }

    /**
     * Gets a value indicating whether the application is online or offline.
     * @returns
     */
    public get isOnline(): boolean {
        return this._isApplicationOnline;
    }

    /**
     * Gets a value indicating whether the navigation is Needed.
     * @returns
     */
    public get allowNavigation(): boolean {
        return this._allowNavigation;
    }

    /**
     * Gets a value indicating the elapsed time.
     * @returns
     */
    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    /**
     * Gets list of modules that is required to download
     * when application comes online
     * @returns
     */
    public get modulesToDownload(): Array<string> {
        return this._modulesToDownload;
    }
}
let instance = new ApplicationStore();
export = { ApplicationStore, instance };