"use strict";
var enums = require('../../../../components/utility/enums');
var localeStore = require('../../../../stores/locale/localestore');
/**
 * This is a Accuracy comparer class and method
 */
var OriginalMarkAccuracyComparer = (function () {
    function OriginalMarkAccuracyComparer() {
    }
    /**
     * Get the Accuracy indicator type
     * @param AccuracyIndicatorType
     */
    OriginalMarkAccuracyComparer.prototype.getAccuracyIndicatorText = function (indicatorType) {
        switch (indicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate');
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate');
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance');
            default:
                return '';
        }
    };
    /** Comparer to sort the work list in ascending order of Accuracy indicator */
    OriginalMarkAccuracyComparer.prototype.compare = function (a, b) {
        if (((a.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(a.accuracyIndicatorTypeID)) >
            ((b.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(b.accuracyIndicatorTypeID))) {
            return 1;
        }
        if (((a.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(a.accuracyIndicatorTypeID)) <
            ((b.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(b.accuracyIndicatorTypeID))) {
            return -1;
        }
        /* The unary plus operator converts it into a number if it is not a number */
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return OriginalMarkAccuracyComparer;
}());
module.exports = OriginalMarkAccuracyComparer;
//# sourceMappingURL=originalmarkaccuracycomparer.js.map