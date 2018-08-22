"use strict";
/**
 * This is a Stamps grouping class and method
 */
var StampsGrouper = (function () {
    function StampsGrouper() {
    }
    /** Grouping the stamps by passed in Group By field */
    StampsGrouper.prototype.group = function (stampData, groupByField) {
        return stampData.groupBy(function (stamp) { return stamp.stampType; });
    };
    return StampsGrouper;
}());
module.exports = StampsGrouper;
//# sourceMappingURL=stampsgrouper.js.map