import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class NavigateAfterMarkConfirmationAction extends action {

    private _navigateFrom: enums.ResponseNavigation;
    private _navigateTo: enums.SaveAndNavigate;

    /**
     * Constructor
     * @param NavigateAfterMarkConfirmation
     */
    constructor(navigateFrom?: enums.ResponseNavigation, navigateTo?: enums.SaveAndNavigate) {
        super(action.Source.View, actionType.NAVIGATE_AFTER_MARKING);
        this._navigateFrom = navigateFrom;
        this._navigateTo = navigateTo;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /* return the where its navigated from */
    public get navigateFrom(): enums.ResponseNavigation {
        return this._navigateFrom;
    }


    /* return the where its navigated from */
    public get navigateTo(): enums.SaveAndNavigate {
        return this._navigateTo;
    }
}

export = NavigateAfterMarkConfirmationAction;