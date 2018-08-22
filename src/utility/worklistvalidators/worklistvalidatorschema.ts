import enums = require('../../components/utility/enums');
import Immutable = require('immutable');
/**
 * Common schema for worklist validators
 */
interface WorkListValidatorSchema {
    /**
     * Submit button Validate
     */
    submitButtonValidate(response: ResponseBase): Immutable.List<enums.ResponseStatus>;
}
export = WorkListValidatorSchema;