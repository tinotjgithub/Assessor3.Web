import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import marksAndAnnotationsVisibilityInfo = require('../../components/utility/annotation/marksandannotationsvisibilityinfo');

class UpdateMarksAndAnnotationVisibilityAction extends action {
    private marksAndAnnotationVisibilityDetails: marksAndAnnotationsVisibilityInfo;
    private index: number;
    private currentEnhancedCommentIndex: number;
    private _isEnhancedoffpageCommentVisible: boolean;

    /**
     * Constructor
     * @param UpdateMarksAndAnnotationVisibility
     */
    constructor(_index: number, _marksAndAnnotationVisibilityDetails: marksAndAnnotationsVisibilityInfo,
        isEnchancedOffpageCommentVisible: boolean, currentEnhancedCommentIndex: number) {
        super(action.Source.View, actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION);
        this.marksAndAnnotationVisibilityDetails = _marksAndAnnotationVisibilityDetails;
        this.index = _index;
        this.currentEnhancedCommentIndex = currentEnhancedCommentIndex;
        this._isEnhancedoffpageCommentVisible = isEnchancedOffpageCommentVisible;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /**
     * returns marks and annotations visibility details
     */
    public get getMarksAndAnnotationVisibilityDetails() {
        return this.marksAndAnnotationVisibilityDetails;
    }

    /**
     * returns marks and annotations visibility details
     */
    public get getIndex() {
        return this.index;
    }

    /**
     * Returns current selected comment index.
     * @readonly
     * @memberof UpdateMarksAndAnnotationVisibilityAction
     */
    public get getCurrentCommentIndex(){
        return this.currentEnhancedCommentIndex;
    }

    /**
     * Gets whether enhanced offpage comment enabled or not.
     * @readonly
     * @memberof UpdateMarksAndAnnotationVisibilityAction
     */
    public get isEnchancedOffpageCommentVisible(){
        return this._isEnhancedoffpageCommentVisible;
    }
}

export = UpdateMarksAndAnnotationVisibilityAction;