import worklistValidatorList = require('./worklistvalidatorlist');
import liveWorklistValidator = require('./liveworklistvalidator');
import worklistvalidatorschema = require('./worklistvalidatorschema');
import standardisationWorklistValidator = require('./standardisationworklistvalidator');
import practiceWorklistValidator = require('./practiceworklistvalidator');
import directedRemarkWorlistValidator = require('./directedremarkworklistvalidator');
import simulationkWorlistValidator = require('./simulationworklistvalidator');

class WorklistValidatorFactory {
   /**
    * returns the validator object.
    * @param comparerName - Name of the validator - should be a member of the worklistvalidatorlist enum.
    */
    public getValidator(validatorName: worklistValidatorList): worklistvalidatorschema {
        let worklistValidator: worklistvalidatorschema = undefined;

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
    }
}

let validatorFactory = new WorklistValidatorFactory();
export = validatorFactory;