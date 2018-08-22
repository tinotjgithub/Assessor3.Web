import enums = require('../../components/utility/enums');

class HistoryBase {
    public worklistType: enums.WorklistType;
    public responseMode: enums.ResponseMode;
    public remarkRequestType: enums.RemarkRequestType;
    public questionPaperPartId: number;
}
export = HistoryBase;