import action = require('../base/action');
import actionType = require('../base/actiontypes');

class AddNewBookmarkAction extends action {
    private _isAddNewBookmarkSelected: boolean;

    /**
     * Constructor AddNewBookmarkAction
     * @param isSelected
     */
    constructor(isSelected: boolean) {
        super(action.Source.View, actionType.ADD_NEW_BOOKMARK_ACTION);
        this._isAddNewBookmarkSelected = isSelected;
    }

    /**
     * This method will return if a bookmark is selected or not
     */
    public get isAddNewBookmarkSelected(): boolean {
        return this._isAddNewBookmarkSelected;
    }
}

export = AddNewBookmarkAction;
