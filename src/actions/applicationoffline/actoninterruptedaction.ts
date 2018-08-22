import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class ActionInterruptedAction extends action {

    private _allowNavigation: boolean;
    private _isFromLogout: boolean;

    /**
     * Constructor
     * @param allowNavigation
     */
    constructor(allowNavigation: boolean = false, isFromLogout: boolean = false) {
        super(action.Source.View, actionType.ACTION_INTERRUPTED_ACTION);
        this._allowNavigation = allowNavigation;
        this._isFromLogout = isFromLogout;
    }

     /**
      * Gets a value indicating whether the navigation is Needed.
      * @returns
      */
    public get allowNavigation(): boolean {
        return this._allowNavigation;
    }

    /**
     * Gets a value indicating interruption was from logout
     */
    public get isFromLogout(): boolean {
        return this._isFromLogout;
    }
}

export = ActionInterruptedAction;