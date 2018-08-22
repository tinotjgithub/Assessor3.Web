"use strict";
var enums = require('../../../../components/utility/enums');
var localeStore = require('../../../../stores/locale/localestore');
/**
 * This is a Accuracy comparer class and method
 */
var AccuracyComparerDesc = (function () {
    function AccuracyComparerDesc() {
    }
    /**
     * Get the Accuracy indicator type
     * @param AccuracyIndicatorType
     */
    AccuracyComparerDesc.prototype.getAccuracyIndicatorText = function (indicatorType) {
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
    /** Comparer to sort the work list in descending order of Accuracy indicator */
    AccuracyComparerDesc.prototype.compare = function (a, b) {
        if (((a.seedTypeId === 0) ? '0' : this.getAccuracyIndicatorText(a.accuracyIndicatorTypeID)) >
            ((b.seedTypeId === 0) ? '0' : this.getAccuracyIndicatorText(b.accuracyIndicatorTypeID))) {
            return -1;
        }
        if (((a.seedTypeId === 0) ? '0' : this.getAccuracyIndicatorText(a.accuracyIndicatorTypeID)) <
            ((b.seedTypeId === 0) ? '0' : this.getAccuracyIndicatorText(b.accuracyIndicatorTypeID))) {
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
    return AccuracyComparerDesc;
}());
module.exports = AccuracyComparerDesc;
//# sourceMappingURL=accuracycomparerdesc.js.map