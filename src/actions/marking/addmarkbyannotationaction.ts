import action = require('../base/action');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');
import enums = require('../../components/utility/enums');

/**
 * The Action class for mark by annotation.
 */
class AddMarkByAnnotationAction extends action {

    private _annotation: annotation;

    private _action: enums.AddAnnotationAction;

    private _annotationOverlayId: string;

    /**
     * constructor
     * @param addedAnnotation
     * @param annotationAction
     * @param annotationOverlayId
     */
    constructor(addedAnnotation: annotation,
        annotationAction?: enums.AddAnnotationAction,
        annotationOverlayId?: string) {
        super(action.Source.View, actionType.ADD_MARK_BY_ANNOTATION_ACTION);
        this._annotation = addedAnnotation;
        this._action = annotationAction;
        this._annotationOverlayId = annotationOverlayId;
    }

   /**
    * Gets added annotation.
    */
    public get annotation() {
        return this._annotation;
    }

   /**
    * Gets annotation action.
    */
    public get action() {
        return this._action;
    }

   /**
    * gets annotation overlayId
    */
    public get annotationOverlayId() {
        return this._annotationOverlayId;
    }
}
export = AddMarkByAnnotationAction;