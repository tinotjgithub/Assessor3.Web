import enums = require('../enums');
import responseAllocationValidationParameter = require('./responseallocationvalidationparameter');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import worklistStore = require('../../../stores/worklist/workliststore');
import qigStore = require('../../../stores/qigselector/qigstore');

/**
 * Helper class for response allocation validation
 */
class ResponseAllocationValidationHelper {

    /**
     * Returns an entity representing the states to be set as a result of Response Allocation request failure
     * @param responseAllocationValidationParameter
     */
    public static Validate(responseAllocationErrorCode: enums.ResponseAllocationErrorCode,
        allocatedResponseCount: number,
        examinerApprovalStatus: enums.ExaminerApproval): responseAllocationValidationParameter {

        let errorDialogHeaderText: string =
            localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-header');
        // get the response allocation error message based on AggregateQIGTargets CC value.
        let errorDialogContentText: string = this.getResponseAllocationErrorMessage(responseAllocationErrorCode);

        let currentWorklistType = worklistStore.instance.currentWorklistType;

        // In simulation worklist examiner approval status is irrelevant
        if (currentWorklistType !== enums.WorklistType.simulation &&
            (examinerApprovalStatus === enums.ExaminerApproval.Suspended
                || examinerApprovalStatus === enums.ExaminerApproval.NotApproved)) {
            errorDialogContentText = localeStore.instance.TranslateText
                ('marking.worklist.approval-status-changed-dialog.body');
        } else {
            // if the error code 'noSeedAvailable', then changing the error code to 'noResponseAvailable'.
            if (responseAllocationErrorCode === enums.ResponseAllocationErrorCode.noSeedAvailable) {
                responseAllocationErrorCode = enums.ResponseAllocationErrorCode.noResponseAvailable;
            }
            switch (responseAllocationErrorCode) {
                case enums.ResponseAllocationErrorCode.concurrentLimitNotMet:
                case enums.ResponseAllocationErrorCode.markingLimitReached:
                    errorDialogContentText = errorDialogContentText.replace('{0}', localeHelper.toLocaleString(allocatedResponseCount));
                    break;
                default:
                    errorDialogContentText = localeStore.instance.TranslateText
                        ('marking.worklist.response-allocation-error-dialog.response-allocation-error-'
                        + enums.ResponseAllocationErrorCode[responseAllocationErrorCode]);
                    break;
            }
        }
        return new responseAllocationValidationParameter(errorDialogHeaderText, errorDialogContentText, true);
    }

    /**
     * Return coresponding response allocation error message based on AggregateQIGTargets CC value.
     */

    private static getResponseAllocationErrorMessage(responseAllocationErrorCode: enums.ResponseAllocationErrorCode): string {
        let isAggregateQIGTargetsON = qigStore.instance.isAggregatedQigCCEnabledForCurrentQig;
        if (isAggregateQIGTargetsON && responseAllocationErrorCode === enums.ResponseAllocationErrorCode.markingLimitReached) {
            return localeStore.instance.TranslateText
                ('marking.worklist.response-allocation-error-dialog.response-allocation-error-aggregate-'
                + enums.ResponseAllocationErrorCode[responseAllocationErrorCode]);
        } else {
            return localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-'
                + enums.ResponseAllocationErrorCode[responseAllocationErrorCode]);
        }
    }
}

export = ResponseAllocationValidationHelper;