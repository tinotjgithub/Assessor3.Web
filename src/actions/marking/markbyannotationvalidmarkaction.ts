import action = require('../base/action');
import actionType = require('../base/actiontypes');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import annotation = require('../../stores/response/typings/annotation');
import enums = require('../../components/utility/enums');
/**
 * The Action class for annotation mark exceed action.
 */
class MarkByAnnotationValidMarkAction extends action {

    private _annotation: annotation;
    private _annotationAction: enums.AddAnnotationAction;
    private _annotationOverlayID: string;

    /**
     * constructor
     */
    constructor(newannotation: annotation, annotaitonAction: enums.AddAnnotationAction, annotationOverlayID: string) {
        super(action.Source.View, actionType.VALID_MARK);
        this._annotation = newannotation;
        this._annotationAction = annotaitonAction;
        this._annotationOverlayID = annotationOverlayID;
    }

    /**
     * Get Added Annotation Action
     */
    public get annotationAction(): enums.AddAnnotationAction {
        return this._annotationAction;
    }

    /**
     * Get Annotation
     */
    public get annotation(): annotation {
        return this._annotation;
    }

    /*
    * gets annotation oerlay id
    */
    public get annotationOverlayID(): string {
        return this._annotationOverlayID;
    }
}
export = MarkByAnnotationValidMarkAction;