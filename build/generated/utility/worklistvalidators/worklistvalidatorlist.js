/**
 * List of validators used for worklists. An entry should be added to this enum for all worklist validators
 */
"use strict";
var WorklistValidatorList;
(function (WorklistValidatorList) {
    WorklistValidatorList[WorklistValidatorList["liveOpen"] = 0] = "liveOpen";
    WorklistValidatorList[WorklistValidatorList["atypicalOpen"] = 1] = "atypicalOpen";
    WorklistValidatorList[WorklistValidatorList["standardisationOpen"] = 2] = "standardisationOpen";
    WorklistValidatorList[WorklistValidatorList["practiceOpen"] = 3] = "practiceOpen";
    WorklistValidatorList[WorklistValidatorList["directedRemarkOpen"] = 4] = "directedRemarkOpen";
    WorklistValidatorList[WorklistValidatorList["simulationOpen"] = 5] = "simulationOpen";
})(WorklistValidatorList || (WorklistValidatorList = {}));
module.exports = WorklistValidatorList;
//# sourceMappingURL=worklistvalidatorlist.js.map