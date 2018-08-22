import worklistHelper = require('./worklisthelper');
import enums = require('../../components/utility/enums');
import remarkworklisthelper = require('../../components/utility/grid/worklisthelpers/remarkworklisthelper');
import liveworklisthelper = require('../../components/utility/grid/worklisthelpers/liveworklisthelper');
import atypicalworklisthelper = require('../../components/utility/grid/worklisthelpers/atypicalworklisthelper');
import practiceworklisthelper = require('../../components/utility/grid/worklisthelpers/practiceworklisthelper');
import secondstandardisationworklisthelper = require('../../components/utility/grid/worklisthelpers/secondstandardisationworklisthelper');
import standardisationworklisthelper = require('../../components/utility/grid/worklisthelpers/standardisationworklisthelper');
import worklistStore = require('../../stores/worklist/workliststore');
import markingCheckWorklistHelper = require('../../components/utility/grid/worklisthelpers/markingcheckworklisthelper');
import simulationWorklistHelper = require('../../components/utility/grid/worklisthelpers/simulationworklisthelper');

class WorkListFactory {

    /**
     * returns the worklist helper object based on the type
     * @param worklistType
     */
    public getWorklistHelper(worklistType: enums.WorklistType): worklistHelper {

        let worklistHelper: worklistHelper;

        switch (worklistType) {
            case enums.WorklistType.live:
                worklistHelper = worklistStore.instance.isMarkingCheckMode ?
                    new markingCheckWorklistHelper() : new liveworklisthelper();
                break;
            case enums.WorklistType.atypical:
                worklistHelper = new atypicalworklisthelper();
                break;
            case enums.WorklistType.practice:
                worklistHelper = new practiceworklisthelper();
                break;
            case enums.WorklistType.standardisation:
                worklistHelper = new standardisationworklisthelper();
                break;
            case enums.WorklistType.secondstandardisation:
                worklistHelper = new secondstandardisationworklisthelper();
                break;
            case enums.WorklistType.directedRemark:
            case enums.WorklistType.pooledRemark:
                worklistHelper = new remarkworklisthelper();
                break;
            case enums.WorklistType.simulation:
                worklistHelper = new simulationWorklistHelper();
                break;
        }

        return worklistHelper;
    }
}

let workListFactory = new WorkListFactory();
export = workListFactory;