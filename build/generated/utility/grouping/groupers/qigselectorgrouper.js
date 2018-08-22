"use strict";
var enums = require('../../../components/utility/enums');
/**
 * This is a QIG List grouping class and method
 */
var QigSelectorGrouper = (function () {
    function QigSelectorGrouper() {
    }
    /** Grouping the qig list by passed in Group By field */
    QigSelectorGrouper.prototype.group = function (qigList, groupByField) {
        var qigs;
        switch (groupByField) {
            case enums.GroupByField.questionPaper:
                qigs = qigList.groupBy(function (qig) {
                    return (qig.isAggregateQIGTargetsON ? qig.groupId : qig.questionPaperPartId);
                });
                break;
        }
        return qigs;
    };
    return QigSelectorGrouper;
}());
module.exports = QigSelectorGrouper;
//# sourceMappingURL=qigselectorgrouper.js.map