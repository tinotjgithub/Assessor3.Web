import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class DynamicAnnotationMoveAction extends action {
    private _isAnnotationActive: boolean;
    constructor(isAnnotationActive: boolean) {
        super(action.Source.View, actionType.DYNAMIC_ANNOTATION_DRAGGING);
        this._isAnnotationActive = isAnnotationActive;
    }

    public get isAnnotationActive(): boolean {
        return this._isAnnotationActive;
    }
}
export = DynamicAnnotationMoveAction;
