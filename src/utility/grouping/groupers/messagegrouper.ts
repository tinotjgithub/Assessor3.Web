import grouperBase = require('../groupingbase/grouperbase');
import enums = require('../../../components/utility/enums');

/**
 * This is a Message grouping class and method
 */
class MessageGrouper implements grouperBase {
    /** Grouping the message list by passed in Group By field */
    public group(qigList: Immutable.List<Message>, groupByField: enums.GroupByField): Immutable.KeyedCollection<any, any> {

        let qigs: Immutable.KeyedCollection<any, any>;
        switch (groupByField) {
            case enums.GroupByField.qig:
                qigs = qigList.groupBy((message: Message) => { return message.markSchemeGroupId; });
                break;
        }

        return qigs;
    }
}

export = MessageGrouper;