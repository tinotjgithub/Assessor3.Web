import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');

/**
 * Update annotation action
 */
class UpdateAnnotationColorAction extends action {
    private _currentAnnotation: annotation;

    /**
     * Constructor
     * @param currentAnnotation
     */
    constructor(currentAnnotation: annotation) {
        super(action.Source.View, actionType.UPDATE_ANNOTATION_COLOR);
        this._currentAnnotation = currentAnnotation;

        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', currentAnnotation.annotationId.toString())
            .replace('{1}', currentAnnotation.markSchemeId.toString())
            .replace('{2}', currentAnnotation.markGroupId.toString())
            .replace('{3}', currentAnnotation.pageNo.toString())
            .replace('{4}', currentAnnotation.outputPageNo.toString())
            .replace('{5}', currentAnnotation.height.toString())
            .replace('{6}', currentAnnotation.width.toString())
            .replace('{7}', currentAnnotation.leftEdge.toString())
            .replace('{8}', currentAnnotation.blue.toString())
            .replace('{9}', currentAnnotation.green.toString())
            .replace('{10}', currentAnnotation.red.toString())
            .replace('{11}', currentAnnotation.imageClusterId == null ? '' : currentAnnotation.imageClusterId.toString());
    }

    /**
     * Get annotation.
     */
    public get currentAnnotation(): annotation {
        return this._currentAnnotation;
    }
}

export = UpdateAnnotationColorAction;