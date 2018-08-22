"use strict";
var enums = require('../../../../components/utility/enums');
var localeStore = require('../../../../stores/locale/localestore');
/**
 * This is a Accuracy comparer class and method
 */
var OriginalMarkAccuracyComparerDesc = (function () {
    function OriginalMarkAccuracyComparerDesc() {
    }
    /**
     * Get the Accuracy indicator type
     * @param AccuracyIndicatorType
     */
    OriginalMarkAccuracyComparerDesc.prototype.getAccuracyIndicatorText = function (indicatorType) {
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
    OriginalMarkAccuracyComparerDesc.prototype.compare = function (a, b) {
        if (((a.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(a.accuracyIndicatorTypeID)) >
            ((b.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(b.accuracyIndicatorTypeID))) {
            return -1;
        }
        if (((a.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(a.accuracyIndicatorTypeID)) <
            ((b.markingProgress < 100) ? '0' : this.getAccuracyIndicatorText(b.accuracyIndicatorTypeID))) {
            return 1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return OriginalMarkAccuracyComparerDesc;
}());
module.exports = OriginalMarkAccuracyComparerDesc;
//# sourceMappingURL=originalmarkaccuracycomparerdesc.js.map