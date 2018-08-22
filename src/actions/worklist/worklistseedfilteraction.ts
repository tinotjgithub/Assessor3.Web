import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class WorklistSeedFilterAction extends action {

    /**
     * to store selected filter
     */
    private _selectedFilter: enums.WorklistSeedFilter;
    private _examinerRoleId: number = 0;

    /**
     * Constroctor for the Worklist Seed Filter Action
     * @param selectedExaminerRoleId
     * @param selectedFilter
     */
    constructor(selectedExaminerRoleId: number, selectedFilter: enums.WorklistSeedFilter) {
        super(action.Source.View, actionType.WORKLIST_FILTER_SELECTED);

        this._selectedFilter = selectedFilter;
        this._examinerRoleId = selectedExaminerRoleId;
    }

    /**
     * Get the selected Filter
     */
    public get getSelectedFilter() {
        return this._selectedFilter;
    }

    /**
     * Get the examiner Role Id
     */
    public get getExaminerRoleId() {
        return this._examinerRoleId;
    }
}

export = WorklistSeedFilterAction;