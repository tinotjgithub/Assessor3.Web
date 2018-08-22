import grouperFactory = require('./groupingbase/grouperfactory');
import grouperBase = require('./groupingbase/grouperbase');
import grouperList = require('./groupingbase/grouperlist');
import enums = require('../../components/utility/enums');

/**
 * Helper class for grouping of a list of any objects
 */
class GroupHelper {
	/**
	 * Returns the grouped list
	 * @param listToGroup
	 * @param grouperName
	 * @param groupByField
	 */
    public static group(listToGroup: Immutable.List<any>, grouperName: grouperList, groupByField: enums.GroupByField) {
        let grouperObject = grouperFactory.getGrouper(grouperName) as grouperBase;

        if (grouperObject) {
            return grouperObject.group(listToGroup, groupByField);
        } else {
            /** Throwing an exception of grouper not found */
            throw Error('Grouper not found.');
        }
    }
}

export = GroupHelper;


