"use strict";
var enums = require('../../components/utility/enums');
var constants = require('../../components/utility/constants');
var markingStore = require('../../stores/marking/markingstore');
/**
 * Base class of accuracy rules
 */
var AccuracyRuleBase = (function () {
    /**
     * Constructor
     * @param responseMode
     * @param markGroupId
     */
    function AccuracyRuleBase(responseMode, markGroupId) {
        this.responseMode = responseMode;
        this.examinerMarksAndAnnotation = markingStore.instance.currentExaminerMarksAgainstResponse(markGroupId);
    }
    /**
     * returns the NR discrepancy
     * @param accuracyIndicator
     */
    AccuracyRuleBase.prototype.DetectNRDiscrepancy = function (accuracyIndicator) {
        return (accuracyIndicator === enums.AccuracyIndicatorType.AccurateNR
            || accuracyIndicator === enums.AccuracyIndicatorType.OutsideToleranceNR
            || accuracyIndicator === enums.AccuracyIndicatorType.WithinToleranceNR);
    };
    /**
     * get the mark number from the mark string
     * @param mark
     */
    AccuracyRuleBase.prototype.getActualMark = function (mark) {
        if (!mark || mark === constants.NOT_MARKED || mark === constants.NOT_ATTEMPTED) {
            return 0;
        }
        else {
            return parseFloat(mark);
        }
    };
    /**
     * function to get the definitive mark form previous mark
     * @param previousMarks
     */
    AccuracyRuleBase.prototype.getDefinitiveMark = function (previousMarks) {
        var definitiveMark = null;
        previousMarks.forEach(function (prevMark) {
            if (prevMark.isDefinitive === true) {
                definitiveMark = prevMark;
            }
        });
        return definitiveMark;
    };
    /**
     * function to get the original marker mark form previous mark
     * @param previousMarks
     */
    AccuracyRuleBase.prototype.getOriginalMark = function (previousMarks) {
        var originalMark = null;
        previousMarks.forEach(function (prevMark) {
            if (prevMark.isOriginalMark === true) {
                originalMark = prevMark;
            }
        });
        return originalMark;
    };
    return AccuracyRuleBase;
}());
module.exports = AccuracyRuleBase;
//# sourceMappingURL=accuracyrulebase.js.map