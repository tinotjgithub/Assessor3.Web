import enums = require('../../components/utility/enums');
import historyBase = require('./historybase');

class StandardisationSetupHistoryInfo extends historyBase {
    public standardisationSetupWorklistType: enums.StandardisationSetup;
    public timeStamp: number;
}

export = StandardisationSetupHistoryInfo;