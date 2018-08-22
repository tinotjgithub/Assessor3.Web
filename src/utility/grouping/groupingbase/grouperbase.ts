import enums = require('../../../components/utility/enums');

/**
 * Interface for groupers. This interface should be implemented in all grouper class across the system and define the group method.
 */
interface GrouperBase {

    /** Group method. This should be defined in all groupers. */
    group(a: Immutable.List<any>, groupByField: enums.GroupByField);
}

export = GrouperBase;