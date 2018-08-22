import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
class SupervisorRemarkCheckAction extends action {

    private _supervisorRemarkValidationReturn: SupervisorRemarkValidationReturn;

    /**
     * Initializing a new instance of supervisor check action.
     */
    constructor(supervisorRemarkValidationReturn: SupervisorRemarkValidationReturn) {
        super(action.Source.View, actionType.SUPERVISOR_REMARK_CHECK_ACTION);
        this._supervisorRemarkValidationReturn = supervisorRemarkValidationReturn;
    }

    /**
     * Get the supervisor remark validation return data.
     */
    public get SupervisorRemarkValidationReturn(): SupervisorRemarkValidationReturn {
        return this._supervisorRemarkValidationReturn;
    }
}
export = SupervisorRemarkCheckAction;
