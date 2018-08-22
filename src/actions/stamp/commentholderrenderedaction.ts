import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action for rendering the comment container from other components
 */
class CommentHolderRenderedAction extends action {

    private _outputPageNo: number;
    private _minHeight: number;

    /**
     * constructor for the action object
     */
    constructor(outputPageNo: number, minHeight: number) {
        super(action.Source.View, actionType.COMMENT_HOLDER_RENDERED_ACTION);
        this._outputPageNo = outputPageNo;
        this._minHeight = minHeight;
    }

    /**
     * return the value of output page number
     */
    public get outputPageNo(): number {
        return this._outputPageNo;
    }

    /**
     * return the value on miminmum height
     */
    public get minHeight(): number {
        return this._minHeight;
    }
}

export = CommentHolderRenderedAction;
