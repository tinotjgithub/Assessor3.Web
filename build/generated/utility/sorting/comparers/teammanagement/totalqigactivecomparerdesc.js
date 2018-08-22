"use strict";
/**
 * This comparer is used for sorting in Help Examiners Grid.
 */
var TotalQIGActiveComparerDesc = (function () {
    function TotalQIGActiveComparerDesc() {
    }
    /**
     * Comparer to sort the help examiners grid in descending order of active qig count.
     */
    TotalQIGActiveComparerDesc.prototype.compare = function (a, b) {
        if (+a.activeQigCount > +b.activeQigCount) {
            return -1;
        }
        if (+a.activeQigCount < +b.activeQigCount) {
            return 1;
        }
        return 0;
    };
    return TotalQIGActiveComparerDesc;
}());
module.exports = TotalQIGActiveComparerDesc;
//# sourceMappingURL=totalqigactivecomparerdesc.js.map