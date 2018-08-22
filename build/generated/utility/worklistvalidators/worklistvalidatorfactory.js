"use strict";
var worklistValidatorList = require('./worklistvalidatorlist');
var liveWorklistValidator = require('./liveworklistvalidator');
var standardisationWorklistValidator = require('./standardisationworklistvalidator');
var practiceWorklistValidator = require('./practiceworklistvalidator');
var directedRemarkWorlistValidator = require('./directedremarkworklistvalidator');
var simulationkWorlistValidator = require('./simulationworklistvalidator');
var WorklistValidatorFactory = (function () {
    function WorklistValidatorFactory() {
    }
    /**
     * returns the validator object.
     * @param comparerName - Name of the validator - should be a member of the worklistvalidatorlist enum.
     */
    WorklistValidatorFactory.prototype.getValidator = function (validatorName) {
        var worklistValidator = undefined;
        switch (validatorName) {
            /** instance of liveWorklistValidator to be registered in this factory */
            case worklistValidatorList.liveOpen:
            case worklistValidatorList.atypicalOpen:
                worklistValidator = new liveWorklistValidator();
                break;
            case worklistValidatorList.standardisationOpen:
                worklistValidator = new standardisationWorklistValidator();
                break;
            case worklistValidatorList.practiceOpen:
                worklistValidator = new practiceWorklistValidator();
                break;
            case worklistValidatorList.directedRemarkOpen:
                worklistValidator = new directedRemarkWorlistValidator();
                break;
            case worklistValidatorList.simulationOpen:
                worklistValidator = new simulationkWorlistValidator();
        }
        /** returns the validator object corresponding to  the name */
        return worklistValidator;
    };
    return WorklistValidatorFactory;
}());
var validatorFactory = new WorklistValidatorFactory();
module.exports = validatorFactory;
//# sourceMappingURL=worklistvalidatorfactory.js.map