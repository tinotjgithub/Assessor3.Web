import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dynamicElementProperties = require('../../components/response/annotations/typings/dynamicelementproperties');

/**
 * The Action class to update the moving element properties
 */
class DynamicAnnotationMoveAction extends action {
    private _movingElementProperties: dynamicElementProperties;
    /**
     * Initializing a new instance.
     */
    constructor(movingElementProperties: dynamicElementProperties) {
        super(action.Source.View, actionType.DYNAMIC_ANNOTATION_MOVE);

        this._movingElementProperties = movingElementProperties;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', movingElementProperties.visible.toString());
    }
    /**
     * movingElementProperties property
     */
    public get movingElementProperties(): dynamicElementProperties {
        return this._movingElementProperties;
    }
}

export = DynamicAnnotationMoveAction;