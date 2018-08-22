import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import historyItem = require('../../utility/breadcrumb/historyItem');
import enums = require('../../components/utility/enums');

/**
 * Action for setting standardisation history info in store before navigation
 */
class StandardisationSetupHistoryInfoAction extends action {

    private _historyItem: historyItem;

    /**
     * Constructor
     * @param historyItem
     */
    constructor(historyItem: historyItem) {
        super(action.Source.View, actionType.STANDARDISATION_SETUP_HISTORY_INFO);
        this._historyItem = historyItem;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedWorkList}/g,
           enums.StandardisationSetup[this._historyItem.standardisationSetup.standardisationSetupWorklistType]);
    }

    /**
     * Returns current standisation history item
     */
    public get historyItem(): historyItem {
        return this._historyItem;
    }
}

export = StandardisationSetupHistoryInfoAction;