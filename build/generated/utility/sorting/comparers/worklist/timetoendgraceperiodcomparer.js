"use strict";
/**
 * This is a Response ID comparer class and method
 */
var TimeToEndGracePeriodComparer = (function () {
    function TimeToEndGracePeriodComparer() {
    }
    /** Comparer to sort the work list in ascending order of Time To End Grace Period */
    TimeToEndGracePeriodComparer.prototype.compare = function (a, b) {
        if (a.timeToEndOfGracePeriod > b.timeToEndOfGracePeriod) {
            return 1;
        }
        if (a.timeToEndOfGracePeriod < b.timeToEndOfGracePeriod) {
            return -1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return TimeToEndGracePeriodComparer;
}());
module.exports = TimeToEndGracePeriodComparer;
//# sourceMappingURL=timetoendgraceperiodcomparer.js.map