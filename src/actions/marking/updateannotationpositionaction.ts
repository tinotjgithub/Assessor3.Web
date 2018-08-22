import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');

/**
 * Update annotation action
 */
class UpdateAnnotationPositionAction extends action {
    private _draggedAnnotationClientToken: string;
    private _leftEdge: number;
    private _topEdge: number;
    private _imageClusterId: number;
    private _outputPageNo: number;
    private _pageNo: number;
    private _width: number;
    private _height: number;
    private _comment: string;
    private _isPositionUpdated: boolean;
    private _isDrawEndOfStampFromStampPanel: boolean;
    private _avoidEventEmit: boolean;
    private _stampId: number;

    /**
     * Constructor
     * @param leftEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param draggedAnnotationClientToken
     * @param width
     * @param height
     * @param comment
     * @param isPositionUpdated
     * @param isDrawEndOfStampFromStampPanel
     * @param stampId
     */
    constructor(leftEdge: number,
        topEdge: number,
        imageClusterId: number,
        outputPageNo: number,
        pageNo: number,
        draggedAnnotationClientToken: string,
        width: number,
        height: number,
        comment?: string,
        isPositionUpdated: boolean = true,
        isDrawEndOfStampFromStampPanel: boolean = false,
        avoidEventEmit: boolean = false,
        stampId?: number) {

        super(action.Source.View, actionType.UPDATE_ANNOTATION);

        this._leftEdge = leftEdge;
        this._topEdge = topEdge;
        this._imageClusterId = imageClusterId !== undefined ? imageClusterId : 0;
        this._outputPageNo = outputPageNo !== undefined ? outputPageNo : 0;
        this._pageNo = pageNo !== undefined ? pageNo : 0;
        this._draggedAnnotationClientToken = draggedAnnotationClientToken;
        this._width = width;
        this._height = height;
        this._comment = (comment !== undefined) ? comment : '';
        this._isPositionUpdated = isPositionUpdated;
        this._isDrawEndOfStampFromStampPanel = isDrawEndOfStampFromStampPanel;
        this._avoidEventEmit = avoidEventEmit;
        this._stampId = stampId !== undefined ? stampId : 0;

        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', this._draggedAnnotationClientToken)
            .replace('{1}', this._pageNo.toString())
            .replace('{2}', this._imageClusterId.toString())
            .replace('{3}', this._outputPageNo.toString())
            .replace('{4}', this._leftEdge.toString())
            .replace('{5}', this._topEdge.toString())
            .replace('{6}', this._width.toString())
            .replace('{7}', this._height.toString())
            .replace('{8}', this._comment.toString())
            .replace('{9}', this._isPositionUpdated.toString())
            .replace('{10}', this._isDrawEndOfStampFromStampPanel.toString())
            .replace('{11}', this._stampId.toString())
            .replace('{12}', this._avoidEventEmit.toString());
    }

    /**
     * Returns stamp id of draw ended annottaion
     */
    public get stampId(): number {
        return this._stampId;
    }

    /**
     * Returns true if annotaion draw end
     */
    public get isDrawEndOfStampFromStampPanel(): boolean {
        return this._isDrawEndOfStampFromStampPanel;
    }

    /**
     * Return true if position of the annotation changed
     */
    public get isPositionUpdated(): boolean {
        return this._isPositionUpdated;
    }

    /**
     * Return true for avoiding event emition
     */
    public get avoidEventEmition(): boolean {
        return this._avoidEventEmit;
    }

    /**
     * Left edge property
     */
    public get leftEdge(): number {
        return this._leftEdge;
    }

    /**
     * Top edge property
     */
    public get topEdge(): number {
        return this._topEdge;
    }

    /**
     * Currently dragged client token property
     */
    public get draggedAnnotationClientToken(): string {
        return this._draggedAnnotationClientToken;
    }

    /**
     * Currently dragged image cluster id
     */
    public get imageClusterId(): number {
        return this._imageClusterId;
    }

    /**
     * Currently dragged output page no
     */
    public get outputPageNo(): number {
        return this._outputPageNo;
    }

    /**
     * Currently dragged page no
     */
    public get pageNo(): number {
        return this._pageNo;
    }

    /**
     * Returns width of the annotation
     */
    public get width(): number {
        return this._width;
    }

    /**
     * Returns height of the annotation
     */
    public get height(): number {
        return this._height;
    }

    /**
     * Returns comment text
     */
    public get comment(): string {
        return this._comment;
    }
}

export = UpdateAnnotationPositionAction;