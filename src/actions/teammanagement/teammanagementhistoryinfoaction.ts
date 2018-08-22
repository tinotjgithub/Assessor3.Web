import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import historyItem = require('../../utility/breadcrumb/historyItem');
import enums = require('../../components/utility/enums');

class TeamManagementHistoryInfoAction extends action {
    private _historyItem: historyItem;
    private _markingMode: enums.MarkerOperationMode;
    private _failureCode: enums.FailureCode;

    /**
     * Constructor
     * @param historyItem
     * @param markingMode
     * @param markingMode
     * @param failureCode
     */
    constructor(historyItem: historyItem, markingMode: enums.MarkerOperationMode,
        failureCode: enums.FailureCode) {
        super(action.Source.View, actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION);
        this._historyItem = historyItem;
        this._markingMode = markingMode;
        this._failureCode = failureCode;
    }

    /**
     * Returns the current history item
     */
    public get historyItem(): historyItem {
        return this._historyItem;
    }

    /**
     * Returns the marker mode
     */
    public get markingMode(): enums.MarkerOperationMode {
        return this._markingMode;
    }

    /**
     * Returns the failure code
     */
    public get failureCode(): enums.FailureCode {
        return this._failureCode;
    }

}

export = TeamManagementHistoryInfoAction;
