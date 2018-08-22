import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class UpdateNavigationAction extends action {

    private _navigateTo: enums.SaveAndNavigate;
    private _doEmit: boolean = true;

    /**
     * Constructor for UpdateNavigationAction
     * @param navigateTo
     * @param doEmit
     */
    constructor(navigateTo: enums.SaveAndNavigate, doEmit: boolean) {
        super(action.Source.View, actionType.NAVIGATION_UPDATE_ACTION);
        this._navigateTo = navigateTo;
        this._doEmit = doEmit;
    }

    /**
     * Show Icons in Header bar
     * @returns flag whether show header icons
     */
    public get navigateTo(): enums.SaveAndNavigate {
        return this._navigateTo;
    }

    /**
     * to ensure emiting event
     * @returns true if it is valid to emit
     */
    public get doEmit(): boolean {
        return this._doEmit;
    }

}

export = UpdateNavigationAction;