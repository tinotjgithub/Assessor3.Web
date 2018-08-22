"use strict";
var enums = require('../../../components/utility/enums');
/**
 * This is a Message grouping class and method
 */
var MessageGrouper = (function () {
    function MessageGrouper() {
    }
    /** Grouping the message list by passed in Group By field */
    MessageGrouper.prototype.group = function (qigList, groupByField) {
        var qigs;
        switch (groupByField) {
            case enums.GroupByField.qig:
                qigs = qigList.groupBy(function (message) { return message.markSchemeGroupId; });
                break;
        }
        return qigs;
    };
    return MessageGrouper;
}());
module.exports = MessageGrouper;
//# sourceMappingURL=messagegrouper.js.map