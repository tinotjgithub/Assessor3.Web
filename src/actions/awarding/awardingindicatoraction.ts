import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import DataRetrievalAction = require('../base/dataretrievalaction');

/**
 *  Action class for awarding action
 */
class AwardingIndicatorAction extends DataRetrievalAction {
    private _isLeftPanelCollapsed: boolean;
    private _awardingAccessDetailsData: AwardingAccessDetails;

    /**
     * Constructor for the leftpanel toggle action
     * @param isLeftPanelCollapsed boolean value indicating whether the panel is in collapsed state or not.
     */
    constructor(success: boolean, json?: AwardingAccessDetails) {
        super(action.Source.View, actionType.GET_AWARDING_ACCESS_DETAILS, success);
        this._awardingAccessDetailsData = json;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Returns the awarding access details data
     */
    public get awardingAccessDetailsData(): AwardingAccessDetails {
        return this._awardingAccessDetailsData;
    }
}

export = AwardingIndicatorAction;