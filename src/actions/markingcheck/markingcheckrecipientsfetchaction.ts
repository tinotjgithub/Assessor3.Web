import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');

/**
 * Action for fetching marking check recipients
 */
class MarkingCheckRecipientsFetchAction extends dataRetrievalAction {

    private _markingCheckRecipientList: Array<MarkingCheckRecipient>;

    /**
     * Constructor for Get Marking Check Information action
     */
    constructor(markingCheckRecipientList: Array<MarkingCheckRecipient>, success: boolean) {
        super(action.Source.View, actionType.GET_MARKING_CHECK_RECIPIENTS, success);
        this._markingCheckRecipientList = markingCheckRecipientList;
    }

    /**
     * Gets the marking check information
     */
    public get MarkingCheckRecipientList(): Array<MarkingCheckRecipient> {

        return this._markingCheckRecipientList;
    }

}

export = MarkingCheckRecipientsFetchAction;