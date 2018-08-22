import grouperBase = require('../groupingbase/grouperbase');
import enums = require('../../../components/utility/enums');
import stampData = require('../../../stores/stamp/typings/stampdata');

/**
 * This is a Stamps grouping class and method
 */
class StampsGrouper implements grouperBase {
    /** Grouping the stamps by passed in Group By field */
    public group(stampData: Immutable.List<stampData>, groupByField: enums.GroupByField)
        : Immutable.KeyedCollection<enums.StampType, Immutable.Iterable<number, stampData>> {

        return stampData.groupBy((stamp: stampData) => { return stamp.stampType; });
    }
}

export = StampsGrouper;