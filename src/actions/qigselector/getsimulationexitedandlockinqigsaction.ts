import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import simulationModeExitedQigList = require('../../stores/qigselector/typings/simulationmodeexitedqiglist');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');

class GetSimulationExitedAndLockInQigsAction extends dataRetrievalAction{

    private _simulationModeExitedQigList: simulationModeExitedQigList;
    private _locksInQigDetailsList: locksInQigDetailsList;
    private _isFromLogout: boolean;

    /**
     *  Constructor of simulation mode exited qigs  and locks in qig action
     * @param successSimulation
     * @param successLocks
     * @param simulationModeExitedQigList
     * @param locksInQigDetailList
     * @param isFromLogout
     */
    constructor(successSimulation: boolean,
        successLocks: boolean,
        simulationModeExitedQigList: simulationModeExitedQigList,
        locksInQigDetailList: locksInQigDetailsList,
        isFromLogout: boolean) {
        super(action.Source.View, actionType.GET_SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS, successSimulation && successLocks);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{successSimulation}/g, successSimulation.toString())
            .replace(/{successLock}/g, successLocks.toString());
        this._simulationModeExitedQigList = simulationModeExitedQigList;
        this._locksInQigDetailsList = locksInQigDetailList;
        this._isFromLogout = isFromLogout;
    }

    /**
     * Retrieves simulation mode exited qigs
     */
    public get simulationModeExitedQigList(): simulationModeExitedQigList{
        return this._simulationModeExitedQigList;
    }

    /**
     * Retrieves no of locks againts QIGs
     */
    public get locksInQigDetailsList(): locksInQigDetailsList {
        return this._locksInQigDetailsList;
    }

    /**
     * Checking whether the call is from logout or not
     */
    public get isFromLogout(): boolean {
        return this._isFromLogout;
    }
}

export = GetSimulationExitedAndLockInQigsAction;