import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import marksAndAnnotationsAisibilityInfo = require('../../components/utility/annotation/marksandannotationsvisibilityinfo');

/**
 * The Action class for Marks And Annotation Vibility status.
 */
class MarksAndAnnotationVibilityChangedAction extends action {

    private _marksAndAnnotationsVisibilityInfo: marksAndAnnotationsAisibilityInfo;

    private _collectionIndex: number;

    /**
     * Initializing a new instance of Marks And Annotation Vibility Changed Action.
     * @param data
     */
    constructor(collectionIndex: number, data: marksAndAnnotationsAisibilityInfo) {
        super(action.Source.View, actionType.REMARK_ITEMS_DISPLAY_STATUS_CHANGED_ACTION);
        this._marksAndAnnotationsVisibilityInfo = data;
        this._collectionIndex = collectionIndex;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /*
    * return the visiblity info of a perticular marks and annotation collection
    */
    public get getMarksAndAnnotationsVisibilityInfo(): marksAndAnnotationsAisibilityInfo {
        return this._marksAndAnnotationsVisibilityInfo;
    }

    /*
    * return the index of the marks and annotation collection to which the visibility need to be changed
    */
    public get getMarksAndAnnotationsCollectionIndexToChange(): number {
        return this._collectionIndex;
    }
}

export = MarksAndAnnotationVibilityChangedAction;