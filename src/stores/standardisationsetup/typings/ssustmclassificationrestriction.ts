import enums = require('../../../components/utility/enums');


/**
 * Arguments to identify if any classfication type is restricted for atleast one STM memeber
 * specified in SSU permission CC
 */
interface SsuStmClassificationRestriction {
    isPracticeRestrictedForAnyStm: boolean;
    isSeedingRestrictedForAnyStm: boolean;
    isStandardisationRestrictedForAnyStm: boolean;
    isStmStandardisationeRestrictedForAnyStm: boolean;
}

export = SsuStmClassificationRestriction;