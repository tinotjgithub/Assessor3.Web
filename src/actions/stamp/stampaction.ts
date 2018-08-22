import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stampList = require('../../stores/stamp/typings/stamplist');

class StampAction extends dataRetrievalAction {

    /**
     * private variables
     */
	private _stampList: stampList;
	private _viaAwarding: boolean;

    /**
     * Constructor StampAction
     * @param success
     * @param stampList
     */
	constructor(success: boolean, stampList: stampList, viaAwarding: boolean) {
        super(action.Source.View, actionType.STAMPS_FETCH, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        // Map the collection
		this._stampList = stampList;
		this._viaAwarding = viaAwarding;
    }

    /*
    * returns the stamp list
    */
    public get stampList() {
        return this._stampList;
	}

	public get viaAwarding(): boolean {
		return this._viaAwarding;
	}
}

export = StampAction;


