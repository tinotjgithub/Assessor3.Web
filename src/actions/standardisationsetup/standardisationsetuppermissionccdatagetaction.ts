import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for fetching Standardisation Setup permission cc data.
 */
class StandardisationSetupPermissionCCDataGetAction extends action {

    private _examinerRole: enums.ExaminerRole;
    private _markSchemeGroupId: number;

    /**
     * Constructor for StandardisationSetupPermissionCCDataGetAction
     */
    constructor(examinerRole: enums.ExaminerRole, markSchemeGroupId: number) {
        super(action.Source.View, actionType.STANDARDISATION_SETUP_PERMISSION_CC_DATA_GET_ACTION);
        this._examinerRole = examinerRole;
        this._markSchemeGroupId = markSchemeGroupId;
    }

    /**
     * Gets examiner role name.
     */
    public get examinerRole() {
        return this._examinerRole;
    }

    /**
     * Gets mark scheme group id.
     */
    public get markSchemeGroupId() {
        return this._markSchemeGroupId;
    }
}
export = StandardisationSetupPermissionCCDataGetAction;