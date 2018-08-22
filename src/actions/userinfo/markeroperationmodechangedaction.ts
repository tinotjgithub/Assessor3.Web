import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for marker operation change
 */
class MarkerOperationModeChangedAction extends action {

    // private variable for holding operation mode
    private _operationMode: enums.MarkerOperationMode;

    // private variable for holding status for load examiner worklist
    private _doLoadCurrentExaminerWorklist: boolean;

    // private variable for holding whether from menu
    private _isFromMenu: boolean;

    /**
     * Consturctor
     * @param operationMode
     */
    constructor(operationMode: enums.MarkerOperationMode, doLoadCurrentExaminerWorklist: boolean, isFromMenu: boolean) {
        super(action.Source.View, actionType.MARKER_OPERATION_MODE_CHANGED_ACTION);
        this._operationMode = operationMode;
        this._isFromMenu = isFromMenu;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{operationMode}/g,
            enums.getEnumString(enums.MarkerOperationMode, this.operationMode));
    }

   /**
    *  Returns the operation mode
    */
    public get operationMode(): enums.MarkerOperationMode {
        return this._operationMode;
    }

    /**
     *  Returns the status whether to load examiner worklist or dont
     */
    public get doLoadCurrentExaminerWorklist(): boolean {
        return this._doLoadCurrentExaminerWorklist;
    }

    /**
     *  Returns whether is from menu or not
     */
    public get isFromMenu(): boolean {
        return this._isFromMenu;
    }

}

export = MarkerOperationModeChangedAction;
