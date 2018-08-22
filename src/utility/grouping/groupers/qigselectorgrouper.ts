import qigSummary = require('../../../stores/qigselector/typings/qigsummary');
import grouperBase = require('../groupingbase/grouperbase');
import enums = require('../../../components/utility/enums');

/**
 * This is a QIG List grouping class and method
 */
class QigSelectorGrouper implements grouperBase {
    /** Grouping the qig list by passed in Group By field */
    public group(qigList: Immutable.List<qigSummary>, groupByField: enums.GroupByField): Immutable.KeyedCollection<any, any> {

        let qigs: Immutable.KeyedCollection<any, any>;
        switch (groupByField) {
            case enums.GroupByField.questionPaper:
                qigs = qigList.groupBy((qig: qigSummary) => {
                    return (qig.isAggregateQIGTargetsON ? qig.groupId : qig.questionPaperPartId);
                 });
                break;
        }

        return qigs;
    }
}

export = QigSelectorGrouper;