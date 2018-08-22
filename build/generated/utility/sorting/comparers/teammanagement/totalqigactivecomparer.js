"use strict";
/**
 * This comparer is used for sorting in Help Examiners Grid.
 */
var TotalQIGActiveComparer = (function () {
    function TotalQIGActiveComparer() {
    }
    /**
     * Comparer to sort the help examiners grid in ascending order of active qig count.
     */
    TotalQIGActiveComparer.prototype.compare = function (a, b) {
        if (+a.activeQigCount > +b.activeQigCount) {
            return 1;
        }
        if (+a.activeQigCount < +b.activeQigCount) {
            return -1;
        }
        return 0;
    };
    return TotalQIGActiveComparer;
}());
module.exports = TotalQIGActiveComparer;
//# sourceMappingURL=totalqigactivecomparer.js.map