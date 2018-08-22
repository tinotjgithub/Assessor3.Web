import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
/**
 * Action class for file list panel toggle
 */
class FileListPanelToggleAction extends action {

    //Holds filelist panel collapsed
    private _isFilelistPanelCollapsed: boolean;

    /**
     * Constructor for FileList Panel Toggle Action
     * @param {boolean} isFilelistPanelCollapsed
     */
    constructor(isFilelistPanelCollapsed: boolean) {
        super(action.Source.View, actionType.FILE_LIST_PANEL_TOGGLE_ACTION);
        this._isFilelistPanelCollapsed = isFilelistPanelCollapsed;
    }

    /**
     * Returns whether the file list panel is collapsed or not
     * @returns
     */
    public get isFilelistPanelCollapsed(): boolean {
        return this._isFilelistPanelCollapsed;
    }
}
export = FileListPanelToggleAction;
