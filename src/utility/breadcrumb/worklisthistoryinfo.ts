import enums = require('../../components/utility/enums');
import historyBase = require('./historybase');

class WorklistHistoryInfo extends historyBase {
    public qigName: string;
    public timeStamp: number;
}

export = WorklistHistoryInfo;