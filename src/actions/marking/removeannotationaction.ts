import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stringHelper = require('../../utility/generic/stringhelper');
import enums = require('../../components/utility/enums');
class RemoveAnnotationAction extends action {
    private _removeAnnotationList: Array<string>;
    private _isPanAvoidImageContainerRender: boolean;
    private _contextMenuType: enums.ContextMenuType;
    private _isLinkAnnotation: boolean;
    private _isMarkByAnnotation: boolean;

    /**
     * Constructor
     * @param removeAnnotationList
     * @param isPanAvoidImageContainerRender
     */
    constructor(
        removeAnnotationList: Array<string>,
        isPanAvoidImageContainerRender: boolean = false,
        contextMenuType: enums.ContextMenuType,
        isLinkAnnotation: boolean,
        isMarkByAnnotation: boolean) {
            super(action.Source.View, actionType.REMOVE_ANNOTATION);
            let errorText: string = this.auditLog.logContent;
            this._removeAnnotationList = removeAnnotationList;
            this._isPanAvoidImageContainerRender = isPanAvoidImageContainerRender;
            this._contextMenuType = contextMenuType;
            this._isLinkAnnotation = isLinkAnnotation;
            let removedAnnotations: string = '';
            removeAnnotationList.forEach((annotationToken: string) => {
                removedAnnotations = removedAnnotations +
                    ' | ' +
                    stringHelper.format(errorText,
                                        [annotationToken]);
            });

            this._isMarkByAnnotation = isMarkByAnnotation;

            this.auditLog.logContent = removedAnnotations;
    }

    /**
     * Get Annotation
     */
    public get removeAnnotationList(): Array<string> {
        return this._removeAnnotationList;
    }

    /**
     * If PAN, avoid image container rerender
     */
    public get isPanAvoidImageContainerRender(): boolean {
        return this._isPanAvoidImageContainerRender;
    }

    /**
     * If PAN, avoid image container rerender
     */
    public get contextMenuType(): enums.ContextMenuType {
        return this._contextMenuType;
    }

    /**
     * returns true, only if the if its a linked annotation.
     */
    public get isLinkAnnotation(): boolean {
        return this._isLinkAnnotation;
    }

    /**
     * return mark by annotation value
     */
    public get isMarkByAnnotation(): boolean {
        return this._isMarkByAnnotation;
    }
}

export = RemoveAnnotationAction;