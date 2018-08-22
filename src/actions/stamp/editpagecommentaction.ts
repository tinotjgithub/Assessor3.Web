
import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');

class EditPageCommentAction extends action {

    // holds the comment stamp attributes
    private _comment: annotation;

    // Holds the left offset position of the stamp in %
    private _leftOffSet: number;

    // Holds the top offset position of the stamp in %
    private _topOffSet: number;

    // Holds the quwestion hierarchy of the stamp
    private _hierarchy: string;

    // The current windows width
    private _windowsWidth: number;

    //annotation overlay width
    private _overlayWidth: number;

    //annotation overlay Height
    private _overlayHeight: number;

    private _wrapper: any;

    private _isCommentBoxReadOnly: boolean;

    private _isCommentBoxInActive: boolean;

    /**
     * Constructor EditPageCommentAction
     * @param commentAttribute
     * @param left
     * @param top
     * @param hierarchy
     * @param windowsWidth
     * @param overlayWidth
     * @param overlayHeight
     * @param wrapper
     * @param isCommentBoxReadOnly
     * @param isCommentBoxInActive
     */
    constructor(commentAttribute: annotation,
        left: number,
        top: number,
        hierarchy: string,
        windowsWidth: number,
        overlayWidth: number,
        overlayHeight: number,
        wrapper: any,
        isCommentBoxReadOnly: boolean,
        isCommentBoxInActive: boolean) {
        super(action.Source.View, actionType.EDIT_ONPAGE_COMMENT);
        this._comment = commentAttribute;
        this._leftOffSet = left;
        this._topOffSet = top;
        this._hierarchy = hierarchy;
        this._windowsWidth = windowsWidth;
        this._overlayHeight = overlayHeight;
        this._overlayWidth = overlayWidth;
        this._wrapper = wrapper;
        this._isCommentBoxReadOnly = isCommentBoxReadOnly;
        this._isCommentBoxInActive = isCommentBoxInActive;
        // Logging
        this.auditLog.logContent = this.auditLog.logContent.replace(/{stampid}/g, this._comment.clientToken)
            .replace(/{hierarchy}/g, this._hierarchy);
    }

    /**
     * Get the comment
     * @returns
     */
    public get comment(): annotation {
        return this._comment;
    }

    /**
     * Get the left offset
     * @returns
     */
    public get leftOffSet(): number {
        return this._leftOffSet;
    }

    /**
     * Get is comment box read only.
     * @returns
     */
    public get isCommentBoxReadOnly(): boolean {
        return this._isCommentBoxReadOnly;
    }

    /**
     * Get is comment box read only.
     * @returns
     */
    public get isCommentBoxInActive(): boolean {
        return this._isCommentBoxInActive;
    }

    /**
     * Get the top offset
     * @returns
     */
    public get topOffSet(): number {
        return this._topOffSet;
    }

    /**
     * Get the question hierarchy where stamp belongs to
     * @returns
     */
    public get qustionHierarhy(): string {
        return this._hierarchy;
    }

    /**
     * Get the Windows Width
     * @returns
     */
    public get windowsWidth(): number {
        return this._windowsWidth;
    }

    /**
     * Get the annotation overlay Height
     * @returns
     */
    public get overlayHeight(): number {
        return this._overlayHeight;
    }

    /**
     * Get the annotation overlay width
     * @returns
     */
    public get overlayWidth(): number {
        return this._overlayWidth;
    }

    /**
     * Get the wrapper
     * @returns
     */
    public get wrapper(): number {
        return this._wrapper;
    }
}
export = EditPageCommentAction;