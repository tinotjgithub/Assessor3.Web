import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');

class SetMarkEntrySelection extends action {

    private _isCommentSelected: boolean;

    private _isBookmarkSelected: boolean;
    /**
     * Constructor
     */
    constructor(commentSelected: boolean, bookmarkSelected: boolean) {
        super(action.Source.View, actionType.SET_MARK_ENTRY_SELECTED);
        this._isCommentSelected = commentSelected;
    }

    /**
     * Get the comment focus Status
     * @returns
     */
    public get isCommentSelected(): boolean {
        return this._isCommentSelected;
    }
}
export = SetMarkEntrySelection;