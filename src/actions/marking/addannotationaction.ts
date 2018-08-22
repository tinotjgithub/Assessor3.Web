import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');
import enums = require('../../components/utility/enums');

class AddAnnotationAction extends action {
    private _annotation: annotation;
    private _annotationAction: enums.AddAnnotationAction;
    private _annotationOverlayId: string;
    private _previousMarkIndex: number;
	private _isStitched: boolean;
    private _avoidEventEmition: boolean;
    private _isPageLinkedByPreviousMarker: boolean;

    /**
     * Constructor
     * @param addedAnnotation
     */
    constructor(addedAnnotation: annotation,
        annotationAction?: enums.AddAnnotationAction,
        annotationOverlayId?: string,
        previousMarkIndex?: number,
		isStitched: boolean = false,
        avoidEventEmition: boolean = false,
        isPageLinkedByPreviousMarker: boolean = false) {
        super(action.Source.View, actionType.ADD_ANNOTATION);
        this._annotation = addedAnnotation;
        this._annotationAction = annotationAction !== undefined ? annotationAction : 0;
        this._annotationOverlayId = annotationOverlayId;
        this._previousMarkIndex = previousMarkIndex;
		this._isStitched = isStitched;
        this._avoidEventEmition = avoidEventEmition;
        this._isPageLinkedByPreviousMarker = isPageLinkedByPreviousMarker;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', addedAnnotation.annotationId.toString())
            .replace('{1}', addedAnnotation.markSchemeId.toString())
            .replace('{2}', addedAnnotation.markGroupId.toString())
            .replace('{3}', addedAnnotation.pageNo.toString())
            .replace('{4}', addedAnnotation.outputPageNo.toString())
            .replace('{5}', addedAnnotation.height.toString())
            .replace('{6}', addedAnnotation.width.toString())
            .replace('{7}', addedAnnotation.leftEdge.toString())
            .replace('{8}', addedAnnotation.blue.toString())
            .replace('{9}', addedAnnotation.green.toString())
            .replace('{10}', addedAnnotation.red.toString())
            .replace('{11}', this._annotationAction.toString())
            .replace('{12}', (previousMarkIndex ? previousMarkIndex : 0).toString());
    }

    /**
     * Get Added Annotation Action
     */
    public get annotationAction(): enums.AddAnnotationAction {
        return this._annotationAction;
    }

    /**
     * Get Added Annotation Action
     */
    public get isStitched(): boolean {
        return this._isStitched;
    }

    /**
     * Get Annotation
     */
    public get annotation(): annotation {
        return this._annotation;
    }

    /**
     * Get Annotation Overlay Id
     */
    public get annotationOverlayId(): string {
        return this._annotationOverlayId;
    }

    /**
     * Get the previous mark index
     */
    public get previousMarkIndex(): number {
        return this._previousMarkIndex;
	}

	/**
	 * Returning true for avoiding event emition
	 */
	public get avoidEventEmition(): boolean {
		return this._avoidEventEmition;
    }

    /**
     * Returning true if the page is linked by peviousmarker
     */
    public get isPageLinkedByPreviousMarker(): boolean {
        return this._isPageLinkedByPreviousMarker;
    }
}

export = AddAnnotationAction;