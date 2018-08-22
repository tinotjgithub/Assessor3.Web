import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import historyItem = require('../../utility/breadcrumb/historyItem');
import enums = require('../../components/utility/enums');

class WorklistHistoryInfoAction extends action {

    private _historyItem: historyItem;
    private _markingMode: enums.MarkerOperationMode;

    /**
     * Constructor
     * @param historyInfo
     */
    constructor(historyItem: historyItem, markingMode: enums.MarkerOperationMode) {
        super(action.Source.View, actionType.WORKLIST_HISTORY_INFO);
        this._historyItem = historyItem;
        this._markingMode = markingMode;
    }

    /**
     * Returns the current history item
     */
    public get historyItem(): historyItem {
        return this._historyItem;
    }

    /**
     * Returns the current marker mode
     */
    public get markingMode(): enums.MarkerOperationMode {
        return this._markingMode;
    }

}

export = WorklistHistoryInfoAction;
