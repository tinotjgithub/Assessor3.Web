import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class StandardisationSelectTabAction extends action {

    private _currentSelectedTab: enums.StandardisationSessionTab;

    /**
     * Constructor 
     * @param selectedTab The type of selected tab in select response
     */
    constructor(selectedTab: enums.StandardisationSessionTab) {
        super(action.Source.View, actionType.STANDARDISATION_SELECT_TAB_ACTION);
        this._currentSelectedTab = selectedTab;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedTab}/g, enums.StandardisationSessionTab[selectedTab]);
    }

    /**
     * Get the Standardisation setup selected tab in select response in SSU
     */
    public get selectedTabInSelectResponse(): enums.StandardisationSessionTab {
        return this._currentSelectedTab;
    }
}
export = StandardisationSelectTabAction;