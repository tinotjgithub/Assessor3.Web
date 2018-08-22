import action = require('../base/action');
import actionType = require('../base/actiontypes');

class PreviousMarksAndAnnotationsCopiedAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.COPIED_PREVIOUS_MARKS_AND_ANNOTATIONS);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = PreviousMarksAndAnnotationsCopiedAction;