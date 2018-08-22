import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Class for triggering saving of marks and Annotations action.
 */
class TriggerSavingMarksAndAnnotationsAction extends action {

    private _saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint;

    /**
     * Constructor TriggerSavingMarksAndAnnotationsAction
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param success
     */
    constructor(saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        success: boolean) {

        super(action.Source.View, actionType.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS);
        this._saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;

        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    /**
     * returns the saveMarksAndAnnotationTriggeringPoint
     */
    public get saveMarksAndAnnotationTriggeringPoint(): enums.SaveMarksAndAnnotationsProcessingTriggerPoint {
        return this._saveMarksAndAnnotationTriggeringPoint;
    }
}

export = TriggerSavingMarksAndAnnotationsAction;