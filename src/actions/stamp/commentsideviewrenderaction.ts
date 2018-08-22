import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action for rendering the comment container from other components
 */
class CommentSideViewRenderAction extends action {

    private _isAnnotationMove: boolean;
    private _stampX: number;
    private _stampY: number;
    private _clientToken: string;
    private _inGreyArea: boolean;

   /**
    * constructor for the action object
    */
    constructor(isAnnotationMove: boolean, stampX: number, stampY: number, clientToken: string,
        inGreyArea: boolean) {
        super(action.Source.View, actionType.COMMENT_SIDE_VIEW_RENDER_ACTION);
        this._isAnnotationMove = isAnnotationMove;
        this._stampX = stampX;
        this._stampY = stampY;
        this._clientToken = clientToken;
        this._inGreyArea = inGreyArea;
    }

    /**
     * return the value whetehr the action triggered on comment anotation move or drag
     */
    public get isAnnotationMove(): boolean {
        return this._isAnnotationMove;
    }

    /**
     * return the value whetehr the action triggered on comment anotation move or drag
     */
    public get stampX(): number {
        return this._stampX;
    }

    /**
     * return the value whetehr the action triggered on comment anotation move or drag
     */
    public get stampY(): number {
        return this._stampY;
    }

    /**
     * return the value of currently selected comment's client token
     */
    public get clientToken(): string {
        return this._clientToken;
    }

    /**
     * return the value of currently selected comment is moving in grey area or not
     */
    public get isInGreyARea(): boolean {
        return this._inGreyArea;
    }
}

export = CommentSideViewRenderAction;
