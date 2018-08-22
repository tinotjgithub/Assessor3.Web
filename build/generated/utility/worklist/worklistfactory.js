"use strict";
var enums = require('../../components/utility/enums');
var remarkworklisthelper = require('../../components/utility/grid/worklisthelpers/remarkworklisthelper');
var liveworklisthelper = require('../../components/utility/grid/worklisthelpers/liveworklisthelper');
var atypicalworklisthelper = require('../../components/utility/grid/worklisthelpers/atypicalworklisthelper');
var practiceworklisthelper = require('../../components/utility/grid/worklisthelpers/practiceworklisthelper');
var secondstandardisationworklisthelper = require('../../components/utility/grid/worklisthelpers/secondstandardisationworklisthelper');
var standardisationworklisthelper = require('../../components/utility/grid/worklisthelpers/standardisationworklisthelper');
var worklistStore = require('../../stores/worklist/workliststore');
var markingCheckWorklistHelper = require('../../components/utility/grid/worklisthelpers/markingcheckworklisthelper');
var simulationWorklistHelper = require('../../components/utility/grid/worklisthelpers/simulationworklisthelper');
var WorkListFactory = (function () {
    function WorkListFactory() {
    }
    /**
     * returns the worklist helper object based on the type
     * @param worklistType
     */
    WorkListFactory.prototype.getWorklistHelper = function (worklistType) {
        var worklistHelper;
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
    };
    return WorkListFactory;
}());
var workListFactory = new WorkListFactory();
module.exports = workListFactory;
//# sourceMappingURL=worklistfactory.js.map