import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class SimulationTargetCompletedAction extends dataRetrievalAction {

    private _isTargetCompleted: boolean;
    private _simulationExitedExaminerRoleIds: Immutable.List<number>;

    /**
     * Constructor for simulation target completed action
     * @param success
     * @param isTargetCompleted
     * @param containerPage
     * @param navigateTo
     */
    constructor(success: boolean, isTargetCompleted: boolean, simulationExitedExaminerRoleIds: Immutable.List<number>) {
        super(action.Source.View, actionType.SIMULATION_TARGET_COMPLETED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isTargetCompleted = isTargetCompleted;
        this._simulationExitedExaminerRoleIds = simulationExitedExaminerRoleIds;
    }

    /**
     * Checking whether the target is completed or not
     */
    public get isTargetCompleted(): boolean {
        return this._isTargetCompleted;
    }

    /**
     * Returns the simulation exited examiner role ids.
     */
    public get simulationExitedExaminerRoleIds(): Immutable.List<number> {
        return this._simulationExitedExaminerRoleIds;
    }
}

export = SimulationTargetCompletedAction;