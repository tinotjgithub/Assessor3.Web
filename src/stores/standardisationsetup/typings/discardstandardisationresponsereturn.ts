import enums = require('../../../components/utility/enums');

/**
 * Discard response Return
 */
interface DiscardStandardisationResponseReturn {
    success: boolean;
    errorMessage: string;
    failureCode: enums.FailureCode;
    discardProvisionalResponseErrorCode: enums.DiscardProvisionalResponseErrorCode;
}
export = DiscardStandardisationResponseReturn;