import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');

class CreateRemarkAction extends dataRetrievalAction {

    //Holds the mark group ID
    private requestRemarkReturn: RequestRemarkReturn;
    private isMarkNowButonClicked: boolean;

    /**
     * Constructor for create remark action
     * @param {number} markgroupId
     * @param {boolean} isMarkNowButtonClicked
     */
    constructor(requestRemarkReturn: RequestRemarkReturn, isMarkNowButtonClicked: boolean) {
        super(action.Source.View, actionType.CREATE_SUPERVISOR_REMARK_ACTION, true);
        this.requestRemarkReturn = requestRemarkReturn;
        this.isMarkNowButonClicked = isMarkNowButtonClicked;
    }

    /**
     * Returns the mark group Id
     * @returns
     */
    public getMarkGroupIds() {
        return this.requestRemarkReturn.markGroupIds;
    }

    /**
     * Returns whether the mark now button is clicked or not
     * @returns
     */
    public isMarkNowButtonClicked() {
        return this.isMarkNowButonClicked;
    }
}
export = CreateRemarkAction;