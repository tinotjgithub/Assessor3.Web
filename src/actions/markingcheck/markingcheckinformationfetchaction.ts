import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');

/**
 * Action for fetching marking check information
 */
class MarkingCheckInformationFetchAction extends dataRetrievalAction {

    private _markingCheckinfo: MarkingCheckInformation;

    /**
     * Constructor for Get Marking Check Information action
     */
    constructor(markingCheckInfo: MarkingCheckInformation, success: boolean) {
        super(action.Source.View, actionType.GET_MARKING_CHECK_INFORMATION, success);
        this._markingCheckinfo = markingCheckInfo;
    }

    /**
     * Gets the marking check information
     */
    public get MarkingCheckInfo(): MarkingCheckInformation {

        return this._markingCheckinfo;
    }
}

export = MarkingCheckInformationFetchAction;