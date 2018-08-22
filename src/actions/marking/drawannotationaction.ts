import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stringHelper = require('../../utility/generic/stringhelper');
class DrawAnnotationAction extends action {
    private _annotationDrawStart: boolean;

    /**
     * Constructor
     * @param annotationDrawStart
     */
    constructor(annotationDrawStart: boolean) {
        super(action.Source.View, actionType.ANNOTATION_DRAW);
        let errorText: string = this.auditLog.logContent;
        this._annotationDrawStart = annotationDrawStart;
    }

    /**
     * Get Annotation
     */
    public get isAnnotationDrawStart(): boolean {
        return this._annotationDrawStart;
    }
}

export = DrawAnnotationAction;