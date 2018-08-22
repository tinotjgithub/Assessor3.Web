import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import userOptionData = require('../../stores/useroption/typings/useroptiondata');
class UserOptionGetAction extends dataRetrievalAction {

    /* for storing retrieved user option */
    private userOptions: userOptionData;
    /**
     * Constructor UserOptionGetAction
     * @param success
     * @param json
     */
    constructor(success: boolean, json?: any) {
        super(action.Source.View, actionType.USER_OPTION_GET, success);
        this.userOptions = json as userOptionData;
    }

    /**
     * for returning user options
     * @returns
     */
    get getUserOptions() {
        return this.userOptions;
    }
}

export = UserOptionGetAction;