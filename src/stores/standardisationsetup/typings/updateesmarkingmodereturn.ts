import enums = require('../../../components/utility/enums');

/**
 * Update ES Marking Mode Return Return
 */
interface UpdateESMarkingModeReturn {
    success: boolean;
    failureCode: number;
    updateESMarkingModeErrorCode: enums.UpdateESMarkingModeErrorCode;
}
export = UpdateESMarkingModeReturn;