import action = require('../base/action');
import actionType = require('../base/actiontypes');
/**
 * The Action class for disabling mbq popup.
 */
class ShowMarkConfirmationPopupOnEnterAction extends action {
    private _keyboardEvent: KeyboardEvent;

    constructor(event: KeyboardEvent) {
        super(action.Source.View, actionType.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_ACTION);
        this._keyboardEvent = event;
    }
    /**
     * returns the key board event that user triggered
     */
    public get keyBoardEvent(): KeyboardEvent {
        return this._keyboardEvent;
    }
}
export = ShowMarkConfirmationPopupOnEnterAction;