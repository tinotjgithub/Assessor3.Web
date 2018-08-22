import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Copy marks and annotation as definitive action.
 */
class CopyMarksAndAnnotationAsDefinitiveAction extends action {

    private _isCopyMarkAsDef: boolean;
    private _doCopyPreviousMark: boolean;
    private _hasAdditionalObject: boolean;

    constructor(success: boolean, isCopyMarkAsDef: boolean, doCopyPreviousMark: boolean, hasAdditionalObject: boolean) {
        super(action.Source.View, actionType.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE);
        this._isCopyMarkAsDef = isCopyMarkAsDef;
        this._doCopyPreviousMark = doCopyPreviousMark;
        this._hasAdditionalObject = hasAdditionalObject;
    }

    public get isCopyMarkAsDefinitive(): boolean {
        return this._isCopyMarkAsDef;
    }

    public get doCopyPreviousMark(): boolean {
        return this._doCopyPreviousMark;
    }

    public get hasAdditionalObject(): boolean {
        return this._hasAdditionalObject;
    }
}
export = CopyMarksAndAnnotationAsDefinitiveAction;
