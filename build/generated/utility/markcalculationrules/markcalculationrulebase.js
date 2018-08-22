"use strict";
var loggingHelper = require('../../components/utility/marking/markingauditlogginghelper');
var loggerHelperConstant = require('../../components/utility/loggerhelperconstants');
var MarkCalculationRuleBase = (function () {
    function MarkCalculationRuleBase() {
    }
    /**
     * Log saving marks action.
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     * @param isUpdateUsedInTotalOnly
     * @param isUpdateMarkingProgress
     * @param markDetails
     */
    MarkCalculationRuleBase.prototype.logSaveMarksAction = function (isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails) {
        var logger = new loggingHelper();
        logger.logMarkSaveAction(loggerHelperConstant.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION, loggerHelperConstant.MARKENTRY_ACTION_TYPE_SAVE_MARK, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails);
    };
    return MarkCalculationRuleBase;
}());
module.exports = MarkCalculationRuleBase;
//# sourceMappingURL=markcalculationrulebase.js.map