import action = require('../base/action');
import actionType = require('../base/actiontypes');

class SetSelectedSideViewCommentAction extends action {

    private _clientToken: string;

    /**
     * constructor for the action
     * @param clientToken
     */
    constructor(clientToken: string) {
        super(action.Source.View, actionType.SET_SELECTED_SIDE_VIEW_COMMENT_ACTION);
        this._clientToken = clientToken;
    }

    public get clientToken(): string {
        return this._clientToken;
    }

}

export = SetSelectedSideViewCommentAction;
