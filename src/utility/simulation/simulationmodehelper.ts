import qigStore = require('../../stores/qigselector/qigstore');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import simulationModeExitedQigList = require('../../stores/qigselector/typings/simulationmodeexitedqiglist');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');
import Immutable = require('immutable');
import simulationTargetCompleteArgument = require('../../stores/qigselector/typings/simulationtargetcompleteargument');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import enums = require('../../components/utility/enums');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import rememberQig = require('../../stores/useroption/typings/rememberqig');
import userOptionsHelper = require('../useroption/useroptionshelper');
import userOptionKeys = require('../useroption/useroptionkeys');
import userInfoStore = require('../../stores/userinfo/userinfostore');
/**
 * Simulation mode helper
 */
class SimulationModeHelper {

    private static storageAdapterHelper: storageAdapterHelper;

    /**
     * To handle calls to get simulation exited qigs a nd locks in qig
     * @param isFromLogout
     */
    public static handleSimulationExitedQigsAndLocksInQig(isFromLogout: boolean) {
        qigSelectorActionCreator.getSimulationExitedQigsAndLocksInQigs(isFromLogout);
    }

    /**
     * Checks if data for simulation exited qigs are available.
     */
    public static get isSimulationExitedQigDataAvailable(): boolean {
        return qigStore.instance.getSimulationModeExitedQigList !== undefined &&
            qigStore.instance.getSimulationModeExitedQigList.qigList.count() > 0;
    }

    /**
     * Checks if data for locks in qig are available
     */
    public static get isLockInQigsDataAvailable(): boolean {
        return qigStore.instance.getLocksInQigList !== undefined &&
            qigStore.instance.getLocksInQigList.locksInQigDetailsList.count() > 0;
    }

    /**
     * To handle calls to set simulation exited qigs target to complete.
     */
    public static handleSimulationTargetCompletion(isFromQigSelector: boolean): void {
        let simulationExitedExaminerRoleIds: Immutable.List<number> = Immutable.List<number>();
        let simulationArgument: simulationTargetCompleteArgument = new simulationTargetCompleteArgument();
        let simulationModeExitedQigList: Immutable.List<SimulationModeExitedQig> = Immutable.List<SimulationModeExitedQig>();
        if (isFromQigSelector) {
            simulationModeExitedQigList = qigStore.instance.getSimulationModeExitedQigList === undefined ?
                undefined :
                qigStore.instance.getSimulationModeExitedQigList.qigList;
            // Pushing the examiner role ids of the simulation exited qigs into list
            if (simulationModeExitedQigList) {
                simulationModeExitedQigList.map((_simulationModeExitedQig: SimulationModeExitedQig) => {
                    simulationExitedExaminerRoleIds = simulationExitedExaminerRoleIds.push(_simulationModeExitedQig.examinerRoleId);
                });
            }
        } else {
            simulationExitedExaminerRoleIds = simulationExitedExaminerRoleIds.push(
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        }
        // Binding to argument
        simulationArgument.simulationExaminerRoleIdList = simulationExitedExaminerRoleIds;

        if (simulationExitedExaminerRoleIds.count() > 0) {
            qigSelectorActionCreator.setSimulationTargetToComplete(simulationArgument);
        }
    }

    /**
     * To check if standardisation setup completion check is necessarry.
     */
    public static shouldCheckForStandardisationSetupCompletion(): boolean {
        // If current target is simulation then standardisation setup completion check should be made
        if (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
            userInfoStore.instance.currentOperationMode !== enums.MarkerOperationMode.Awarding) {
            return !qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation;
        } else {
            return false;
        }
    }

    /**
     *  Checks if the standardisation setup is completed form the failure reasons
     * @param navigationFailureReason
     */
    public static isStandardisationSetupCompletedExitsIn(
        navigationFailureReason: Array<enums.ResponseNavigateFailureReason>): boolean {
        return navigationFailureReason.indexOf(
            enums.ResponseNavigateFailureReason.StandardisationSetupCompletedWhileInSimulation) > -1;
    }

    /**
     * Clears the cache and sets the rember qig data before completing simulation target
     */
    public static clearCacheBeforBeforeSimulationTargetCompletion(): void {
        this.storageAdapterHelper = new storageAdapterHelper();
        // Clearing the cache of qigselector, worklist, marker progress and simulation exited qigs
        this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
        this.storageAdapterHelper.clearStorageArea('worklist');
        this.storageAdapterHelper.clearStorageArea('marker');
        this.storageAdapterHelper.clearCacheByKey('simulationexitedqigs', 'qigdata');

        // Updating remeber qig data
        let _rememberQig: rememberQig = new rememberQig();
        _rememberQig.qigId = 0;
        _rememberQig.area = enums.QigArea.QigSelector;
        _rememberQig.worklistType = enums.WorklistType.none;
        userOptionsHelper.save(userOptionKeys.REMEMBER_PREVIOUS_QIG, JSON.stringify(_rememberQig), true);
    }

    /**
     * Check standardisation setup completion
     */
    public static checkStandardisationSetupCompletion(navigatedFrom: enums.PageContainers,
        navigatedTo: enums.PageContainers, isFromMenu?: boolean): void {
        if ((!qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete || isFromMenu) &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation) {
            qigSelectorActionCreator.checkStandardisationSetupCompleted(
                qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, navigatedFrom, navigatedTo);
        }
    }
}

export = SimulationModeHelper;