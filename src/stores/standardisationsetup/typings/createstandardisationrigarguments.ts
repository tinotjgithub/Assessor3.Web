import Immutable = require('immutable');
import createStandardisationRIGData = require('./createstandardisationrigdata');
import enums = require('../../../components/utility/enums');
/**
 * Create Standardisation RIG Argument
 */
interface CreateStandardisationRIGArguments {
    candidateScriptID: number;
    markSchemeGroupIDs: Array<Number>;
    provisionalMarkingType: enums.ProvisionalMarkingType;
}
export = CreateStandardisationRIGArguments;