"use strict";
/**
 * This comparer is used for default sorting in Help Examiners Grid.
 */
var TotalQIGRequiringComparerDesc = (function () {
    function TotalQIGRequiringComparerDesc() {
    }
    /**
     * Comparer to sort the help examiners grid in descending order of action requiring qig count.
     */
    TotalQIGRequiringComparerDesc.prototype.compare = function (a, b) {
        if (+a.actionRequireQigCount > +b.actionRequireQigCount) {
            return -1;
        }
        if (+a.actionRequireQigCount < +b.actionRequireQigCount) {
            return 1;
        }
        return 0;
    };
    return TotalQIGRequiringComparerDesc;
}());
module.exports = TotalQIGRequiringComparerDesc;
//# sourceMappingURL=totalqigrequiringcomparerdesc.js.map