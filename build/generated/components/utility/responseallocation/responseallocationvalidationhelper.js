"use strict";
var enums = require('../enums');
var responseAllocationValidationParameter = require('./responseallocationvalidationparameter');
var localeStore = require('../../../stores/locale/localestore');
var localeHelper = require('../../../utility/locale/localehelper');
var worklistStore = require('../../../stores/worklist/workliststore');
/**
 * Helper class for response allocation validation
 */
var ResponseAllocationValidationHelper = (function () {
    function ResponseAllocationValidationHelper() {
    }
    /**
     * Returns an entity representing the states to be set as a result of Response Allocation request failure
     * @param responseAllocationValidationParameter
     */
    ResponseAllocationValidationHelper.Validate = function (responseAllocationErrorCode, allocatedResponseCount, examinerApprovalStatus) {
        var errorDialogHeaderText = localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-header');
        var errorDialogContentText = localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-'
            + enums.ResponseAllocationErrorCode[responseAllocationErrorCode]);
        var currentWorklistType = worklistStore.instance.currentWorklistType;
        // In simulation worklist examiner approval status is irrelevant
        if (currentWorklistType !== enums.WorklistType.simulation &&
            (examinerApprovalStatus === enums.ExaminerApproval.Suspended
                || examinerApprovalStatus === enums.ExaminerApproval.NotApproved)) {
            errorDialogContentText = localeStore.instance.TranslateText('marking.worklist.approval-status-changed-dialog.body');
        }
        else {
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
                    errorDialogContentText = localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-'
                        + enums.ResponseAllocationErrorCode[responseAllocationErrorCode]);
                    break;
            }
        }
        return new responseAllocationValidationParameter(errorDialogHeaderText, errorDialogContentText, true);
    };
    return ResponseAllocationValidationHelper;
}());
module.exports = ResponseAllocationValidationHelper;
//# sourceMappingURL=responseallocationvalidationhelper.js.map