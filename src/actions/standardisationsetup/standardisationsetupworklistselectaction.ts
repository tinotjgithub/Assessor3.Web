import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for Standardisation Setup Left Main Link Selection
 */
class StandardisationSetupWorkListSelectAction extends action {

    private _selectedWorkList: enums.StandardisationSetup;

    private _markSchemeGroupId: number;

    private _examinerRoleId: number;

    private _useCache: boolean;

    /**
     * constructor
     * @selectedTab The type of Standardisation setup Tab
     */
    constructor(selectedWorkList: enums.StandardisationSetup, markSchemeGroupId: number, examinerRoleId: number, useCache: boolean) {
        super(action.Source.View, actionType.STANDARDISATION_SETUP_WORKLIST_SELECT_ACTION);
        this._selectedWorkList = selectedWorkList;
        this._markSchemeGroupId = markSchemeGroupId;
        this._examinerRoleId = examinerRoleId;
        this._useCache = useCache;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedTab}/g, selectedWorkList.toString());
    }

    /**
     * Get the Standardisation setup Link Type
     */
    public get selectedWorkList(): enums.StandardisationSetup {
        return this._selectedWorkList;
    }

    /**
     * Get the markSchemeGroupId
     */
    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }

    /**
     * Get the examinerRoleId
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

    /**
     * set cache true or false
     */
    public get useCache(): boolean {
        return this._useCache;
    }
}
export = StandardisationSetupWorkListSelectAction;