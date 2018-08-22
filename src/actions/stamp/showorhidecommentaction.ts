import action = require('../base/action');
import actionType = require('../base/actiontypes');

class ShowOrHideCommentAction extends action {

    // Show Or Hide comment Box 
    private _isOpen: boolean;
    private _isPanAvoidImageContainerRender: boolean;

    /**
     * Constructor ShowOrHideCommentAction
     * @param isOpen
     */
    constructor(isOpen: boolean, isPanAvoidImageContainerRender: boolean) {
        super(action.Source.View, actionType.SHOW_OR_HIDE_ONPAGE_COMMENT);
        this._isOpen = isOpen;
        this._isPanAvoidImageContainerRender = isPanAvoidImageContainerRender;
    }

    // Show Or Hide comment Box 
    public get isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * If PAN, avoid image container rerender
     */
    public get isPanAvoidImageContainerRender(): boolean {
        return this._isPanAvoidImageContainerRender;
    }
}

export = ShowOrHideCommentAction;