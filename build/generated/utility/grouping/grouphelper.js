"use strict";
var grouperFactory = require('./groupingbase/grouperfactory');
/**
 * Helper class for grouping of a list of any objects
 */
var GroupHelper = (function () {
    function GroupHelper() {
    }
    /**
     * Returns the grouped list
     * @param listToGroup
     * @param grouperName
     * @param groupByField
     */
    GroupHelper.group = function (listToGroup, grouperName, groupByField) {
        var grouperObject = grouperFactory.getGrouper(grouperName);
        if (grouperObject) {
            return grouperObject.group(listToGroup, groupByField);
        }
        else {
            /** Throwing an exception of grouper not found */
            throw Error('Grouper not found.');
        }
    };
    return GroupHelper;
}());
module.exports = GroupHelper;
//# sourceMappingURL=grouphelper.js.map