import enums = require('../../components/utility/enums');

interface MessageArgument {
    messageId: number;
    messageDistributionIds: Immutable.List<number>;
    examinerMessageStatusId: enums.MessageReadStatus;
}

export = MessageArgument;