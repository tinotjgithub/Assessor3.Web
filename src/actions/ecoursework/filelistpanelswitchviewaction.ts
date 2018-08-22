import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
class FilelistPanelSwitchViewAction extends action {
    private _currentView: enums.FileListPanelView;
    private _doEmit: boolean = false;

    /**
     * constructor
     * @param currentView
     * @param doEmit
     */
    constructor(currentView: enums.FileListPanelView, doEmit: boolean) {
        super(action.Source.View, actionType.FILELIST_PANEL_SWITCH_VIEW_ACTION);
        this._currentView = currentView;
        this._doEmit = doEmit;
    }

    /**
     * return the current file list panel view
     */
    public get currentView(): enums.FileListPanelView {
        return this._currentView;
    }

    /**
     * returns true if it need to emit event
     */
    public get doEmit(): boolean {
        return this._doEmit;
    }
}
export = FilelistPanelSwitchViewAction;
