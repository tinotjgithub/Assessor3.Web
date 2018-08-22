import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');

class GetLocksInQigsAction extends dataRetrievalAction {
    private _locksInQigDetailsList: locksInQigDetailsList;
    private _isFromLogout: boolean;

    /**
     * Constructor for ShowHeaderIconsAction
     * @param showIcons
     */
    constructor(success: boolean, locksInQigDetailList: locksInQigDetailsList, isFromLogout: boolean) {
        super(action.Source.View, actionType.GET_LOCKS_IN_QIGS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._locksInQigDetailsList = locksInQigDetailList;
        this._isFromLogout = isFromLogout;
    }

    /**
     * Retrieves no of locks againts QIGs
     */
    public get locksInQigDetailsList(): locksInQigDetailsList {
        return this._locksInQigDetailsList;
    }

    /**
     * Checking whether the call is from logout or not
     */
    public get isFromLogout(): boolean {
        return this._isFromLogout;
    }

}

export = GetLocksInQigsAction;
