import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ResetMarksAndAnnotationAction extends action {

    // Flag to indicate whether reset the marks
    private _resetMarks: boolean;

    // Flag to indicate whether reset the annotation
    private _resetAnnotation: boolean;

    // holds the value which is to be retained while 
    // clicking NO in reset Confirmation PopUp
    private _previousMark: AllocatedMark;

    /**
     * @Constructor
     * @param {boolean} resetMarks
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    constructor(resetMarks: boolean, resetAnnotation: boolean, previousMark: AllocatedMark) {

        super(action.Source.View, actionType.RESET_MARKS_AND_ANNOTATION);
        this._resetMarks = resetMarks;
        this._resetAnnotation = resetAnnotation;
        this._previousMark = previousMark;

        // Adding audit log
        //this.auditLog.logContent = this.auditLog.logContent
        //                                .replace(/{0}/g, this._resetMarks.toString())
        //                                .replace(/{1}/g, this._resetAnnotation.toString());
    }

    /**
     * Indicates whethe we need to reset the marks
     * @returns
     */
    public get resetMarks(): boolean {
        return this._resetMarks;
    }

    /**
     * Indicates whethe we need to reset the marks
     * @returns
     */
    public get resetAnnotation(): boolean {
        return this._resetAnnotation;
    }

    /**
     * holds the value which is to be retained while
     * clicking NO in reset Confirmation PopUp
     * @returns
     */
    public get previousMark(): AllocatedMark {
        return this._previousMark;
    }
}
export = ResetMarksAndAnnotationAction;