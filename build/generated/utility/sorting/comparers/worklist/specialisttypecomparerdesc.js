"use strict";
/**
 * This is a Centre number comparer class and method
 */
var SpecialistTypeComparerDesc = (function () {
    function SpecialistTypeComparerDesc() {
    }
    /** Comparer to sort the work list in ascending order of Centre number */
    SpecialistTypeComparerDesc.prototype.compare = function (a, b) {
        if (a.specialistType > b.specialistType) {
            return 1;
        }
        if (a.specialistType < b.specialistType) {
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
    return SpecialistTypeComparerDesc;
}());
module.exports = SpecialistTypeComparerDesc;
//# sourceMappingURL=specialisttypecomparerdesc.js.map