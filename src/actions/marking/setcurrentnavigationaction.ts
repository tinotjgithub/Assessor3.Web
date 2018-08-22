import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class SetCurrentNavigationAction extends dataRetrievalAction {

    // variable for identifying the current response navigation navigation whether it's from markscheme or not.
    private _isNavigationThroughMarkScheme: number;

    /**
     * Constructor SetCurrentNavigationAction
     * @param success
     * @param isNavigationThroughMarkScheme
     */
    constructor(success: boolean, isNavigationThroughMarkScheme: enums.ResponseNavigation) {
        super(action.Source.View, actionType.SET_CURRENT_NAVIGATION_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isNavigationThroughMarkScheme = isNavigationThroughMarkScheme;
    }

    /**
     * This will returns the current response navigation 
     */
    public get isNavigationThroughMarkScheme(): enums.ResponseNavigation {
        return this._isNavigationThroughMarkScheme;
    }
}

export = SetCurrentNavigationAction;