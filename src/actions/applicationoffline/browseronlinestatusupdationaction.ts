import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * The class for updating online status of browser.
 * @param {boolean} success
 */
class BrowserOnlineStatusUpdationAction extends dataRetrievalAction {

    // holds the online status.
    private _isBrowserOnline: boolean;
    private _forceEmit: boolean;

    /**
     * Constructor
     * @param onlineStatus
     */
    constructor(onlineStatus: boolean, forceEmit: boolean = false) {
        super(action.Source.View, actionType.UPDATE_BROWSER_ONLINE_STATUS, onlineStatus);
        this._isBrowserOnline = onlineStatus;
        this._forceEmit = forceEmit;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, onlineStatus.toString());
    }

    /**
     * Gets the browser online status.
     * @returns online status
     */
    public get isOnline(): boolean {
        return this._isBrowserOnline;
    }

    /**
     * Gets is force emit or not
     */
    public get forceEmit(): boolean {
        return this._forceEmit;
    }
}

export = BrowserOnlineStatusUpdationAction;