"use strict";
/**
 * This comparer is used for sorting in Help Examiners Grid.
 */
var TotalQIGRequiringComparer = (function () {
    function TotalQIGRequiringComparer() {
    }
    /**
     * Comparer to sort the help examiners grid in ascending order of action requiring qig count.
     */
    TotalQIGRequiringComparer.prototype.compare = function (a, b) {
        if (+a.actionRequireQigCount > +b.actionRequireQigCount) {
            return 1;
        }
        if (+a.actionRequireQigCount < +b.actionRequireQigCount) {
            return -1;
        }
        return 0;
    };
    return TotalQIGRequiringComparer;
}());
module.exports = TotalQIGRequiringComparer;
//# sourceMappingURL=totalqigrequiringcomparer.js.map