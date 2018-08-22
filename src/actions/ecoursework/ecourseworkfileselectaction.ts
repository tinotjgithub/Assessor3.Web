import action = require('../base/action');
import actionType = require('../base/actiontypes');
import eCourseWorkFile = require('../../stores/response/digital/typings/courseworkfile');
/**
 * Action class for getting the selected courseworkfile
 */
class EcourseworkFileSelectAction extends action {

    private _selectedECourseWorkFile: eCourseWorkFile;
    private _doAutoPlay: boolean;
    private _doSetIndexes: boolean;
    private _isInFullResponseView: boolean;
    /**
     * constructor
     * @param success
     * @param selected
     */
    constructor(selectedECourseWorkFile: eCourseWorkFile, doAutoPlay: boolean, doSetIndexes: boolean, isInFullResponseView: boolean) {
        super(action.Source.View, actionType.ECOURSEWORK_FILE_SELECT_ACTION);
        this.auditLog.logContent =
            this.auditLog.logContent.replace('{docstorePageID}', selectedECourseWorkFile.docPageID.toString());
        this._selectedECourseWorkFile = selectedECourseWorkFile;
        this._doAutoPlay = doAutoPlay;
        this._doSetIndexes = doSetIndexes;
        this._isInFullResponseView = isInFullResponseView;
    }

    /**
     * return selected  ECoursework File
     */
    public get selectedECourseWorkFile(): eCourseWorkFile {
        return this._selectedECourseWorkFile;
    }

    /**
     * return the auto play status of media player
     */
    public get doAutoPlay(): boolean {
        return this._doAutoPlay;
    }

    /**
     * return the reset status of file list indexes
     */
    public get doSetIndexes(): boolean {
        return this._doSetIndexes;
    }

    /**
     * return whether in full response view
     */
    public get isInFullResponseView(): boolean {
        return this._isInFullResponseView;
    }
}
export = EcourseworkFileSelectAction;