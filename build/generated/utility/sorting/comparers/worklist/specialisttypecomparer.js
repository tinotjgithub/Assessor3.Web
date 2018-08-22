"use strict";
/**
 * This is a Centre number comparer class and method
 */
var SpecialistTypeComparer = (function () {
    function SpecialistTypeComparer() {
    }
    /** Comparer to sort the work list in ascending order of Centre number */
    SpecialistTypeComparer.prototype.compare = function (a, b) {
        if (a.specialistType > b.specialistType) {
            return -1;
        }
        if (a.specialistType < b.specialistType) {
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
    return SpecialistTypeComparer;
}());
module.exports = SpecialistTypeComparer;
//# sourceMappingURL=specialisttypecomparer.js.map