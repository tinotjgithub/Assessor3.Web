import action = require('../base/action');
import actionType = require('../base/actiontypes');

class TagListClickAction extends action {

    private _markGroupId: number;

    /**
     * Constructor of tag list click action.
     * @param markGroupId
     */
    constructor(markGroupId: number) {
        super(action.Source.View, actionType.TAG_LIST_CLICK);
        this._markGroupId = markGroupId;
    }

    /**
     * returns the mark group id of which the tag indicator has been selected.
     */
    public get markGroupId(): number {
        return this._markGroupId;
    }
}

export = TagListClickAction;
