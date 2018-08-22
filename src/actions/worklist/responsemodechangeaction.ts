import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * Action when live worklist is selected
 */
class ResponseModeChangeAction extends dataRetrievalAction {
    private responseMode: enums.ResponseMode;
    private _markingCheckMode: boolean;

    /**
     * ResponseModeChangeAction type constructor
     * @param responseMode
     */
    constructor(responseMode: enums.ResponseMode, isMarkingCheckMode: boolean = false) {
        super(action.Source.View, actionType.RESPONSE_MODE_CHANGED, true);
        this.responseMode = responseMode;
        this._markingCheckMode = isMarkingCheckMode;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{responseMode}/g,
            responseMode ? responseMode.toString() : 'undefined');
    }

    /**
     * Gets the response mode
     */
    get getResponseMode(): enums.ResponseMode {
        return this.responseMode;
    }

    /**
     * Gets a value indicating whether current mode is marking check mode
     */
    get isMarkingCheckMode(): boolean {
        return this._markingCheckMode;
    }
}

export = ResponseModeChangeAction;