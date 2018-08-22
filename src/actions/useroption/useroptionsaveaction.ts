import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import userOptionStore = require('../../stores/useroption/useroptionstore');
import userOptionData = require('../../stores/useroption/typings/useroptiondata');

/**
 * Class for saving user action
 * @param {boolean} sucess
 */
class UserOptionSaveAction extends dataRetrievalAction {
    private _savedUserOption: userOptionData;
    /**
     * Constructor UserOptionSaveAction
     * @param {boolean} success
     * @param {boolean} isLogout
     * @param {any} json?
     */
    constructor(success: boolean, isLogout: boolean, json?: any) {
        /** changing the action type based on the logout parameter to emit dofferent actio for saving on logout and other save */
        if (isLogout) {
            super(action.Source.View, actionType.USER_OPTION_SAVE_ON_LOGOUT, success);
        } else {
            super(action.Source.View, actionType.USER_OPTION_SAVE, success);
        }
        /* formating audit log message */
        this._savedUserOption = json as userOptionData;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{useroption}/g, userOptionStore.instance.getUserOptions.toString());
    }

 /**
  * for returning user options
  * @returns
  */
    get getSavedUserOption() {
        return this._savedUserOption;
    }
}

export = UserOptionSaveAction;