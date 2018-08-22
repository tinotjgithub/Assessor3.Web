import Immutable = require('immutable');
import createStandardisationRIGReturnData = require('./createstandardisationrigreturndata');
/**
 * Create Standardisation RIG Argument
 */
interface CreateStandardisationRIGReturn {
    createStandardisationRIGReturnDetails: Immutable.List<createStandardisationRIGReturnData>;
}
export = CreateStandardisationRIGReturn;