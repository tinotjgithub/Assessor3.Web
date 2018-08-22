import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import simulationModeExitedQigList = require('../../stores/qigselector/typings/simulationmodeexitedqiglist');

class GetSimulationModeExitedQigsAction extends dataRetrievalAction {

    private _simulationModeExitedQigList: simulationModeExitedQigList;

    /**
     * Constructor of simulation modeexited qigs action
     * @param success
     * @param simulationModeExitedQigList
     */
    constructor(success: boolean, simulationModeExitedQigList: simulationModeExitedQigList) {
        super(action.Source.View, actionType.GET_SIMULATION_MODE_EXITED_QIGS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._simulationModeExitedQigList = simulationModeExitedQigList;
    }

    /**
     * Retrieves simulation mode exited qigs
     */
    public get simulationModeExitedQigList(): simulationModeExitedQigList {
        return this._simulationModeExitedQigList;
    }
}

export = GetSimulationModeExitedQigsAction;