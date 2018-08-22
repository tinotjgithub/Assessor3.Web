"use strict";
var MarkSchemeComparer = (function () {
    function MarkSchemeComparer() {
    }
    /** Comparer to sort items in ascending order of Mark Scheme names */
    MarkSchemeComparer.prototype.compare = function (a, b) {
        if (a.sequenceNo > b.sequenceNo) {
            return 1;
        }
        if (a.sequenceNo < b.sequenceNo) {
            return -1;
        }
        return 0;
    };
    return MarkSchemeComparer;
}());
module.exports = MarkSchemeComparer;
//# sourceMappingURL=markschemecomparer.js.map