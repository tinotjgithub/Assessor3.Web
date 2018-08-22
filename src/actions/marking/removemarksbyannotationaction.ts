import action = require('../base/action');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class RemoveMarksByAnnotationAction extends action {
    private _removedAnnotation: annotation;

    /**
     * Constructor
     * @param removeAnnotationList
     */
    constructor(removedAnnotation: annotation) {
        super(action.Source.View, actionType.REMOVE_ANNOTATION_MARK);
        this._removedAnnotation = removedAnnotation;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{stamp}/g, removedAnnotation.stamp.toString());
    }

    /**
     * Get selected Annotation
     */
    public get removedAnnotation(): annotation {
        return this._removedAnnotation;
    }
}

export = RemoveMarksByAnnotationAction;