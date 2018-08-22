import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import historyItem = require('../../utility/breadcrumb/historyitem');


class AddToRecentHistoryAction extends action {

    /* history details*/

    private _historyItem: historyItem;

    /**
     * Constructor
     * @param _historyItem
     */
    constructor(_historyItem: historyItem) {
        super(action.Source.View, actionType.ADD_TO_RECENT_HISTORY);
        this._historyItem = _historyItem;
    }

    /* get history data*/
    public get historyItem(): historyItem {
        return this._historyItem;
    }
}

export = AddToRecentHistoryAction;
