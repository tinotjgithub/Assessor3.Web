import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for Full Response View Option Changed Action.
 */
class FullResponseViewOptionChangedAction extends dataRetrievalAction {
    // variable for holding current full response view option
    private _fullResponseViewOption: enums.FullResponeViewOption;

    /**
     * Constructor FullResponseViewOptionChangedAction
     * @param success
     * @param fullResponseViewOption
     */
    constructor(success: boolean, fullResponseViewOption: enums.FullResponeViewOption) {
        super(action.Source.View, actionType.FULL_RESPONSE_VIEW_OPTION_CHANGED, success);
        this._fullResponseViewOption = fullResponseViewOption;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

   /**
    * returns the full response view option.
    */
    public get fullResponseViewOption(): enums.FullResponeViewOption {
        return this._fullResponseViewOption;
    }

}

export = FullResponseViewOptionChangedAction;