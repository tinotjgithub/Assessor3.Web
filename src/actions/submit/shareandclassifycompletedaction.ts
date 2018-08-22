import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');
import shareAndClassifyReturn  = require('../../stores/submit/typings/shareAndClassifyReturn');

/**
 * Action when responses are submitted
 */
class ShareAndClassifyCompletedAction extends dataRetrievalAction {

    private _shareAndClassifyResponseReturn: shareAndClassifyReturn;
    private fromMarkScheme: boolean;
    private _selectedDisplayId: string;


    /**
     * Constructor for ShareAndClassifyResponse
     * @param submitResponseReturn The return values after response submission
     */
    constructor(success: boolean,
        shareAndClassifyReturn: shareAndClassifyReturn,
        fromMarkScheme: boolean,
        selectedDisplayId?: string) {
        super(action.Source.View, actionType.SHARE_AND_CLASSIFY_COMPLETED, success, shareAndClassifyReturn);
        this._shareAndClassifyResponseReturn = shareAndClassifyReturn;
        this.fromMarkScheme = fromMarkScheme;
        this._selectedDisplayId = selectedDisplayId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g,
            success.toString()).replace(/{errorCode}/g, shareAndClassifyReturn.responseShareAndClassifyErrorCode.toString());
    }

    /**
     * Gets the submit response return details
     */
    get getShareAndClassifyResponseReturnDetails() {
        return this._shareAndClassifyResponseReturn;
    }

    /**
     * Gets whether the response has been submitted from markscheme
     */
    get isFromMarkScheme() {
        return this.fromMarkScheme;
    }


    /**
     * Gets the  selectedDisplayId
     */
    get getSelectedDisplayId() {
        return this._selectedDisplayId;
    }

}
export = ShareAndClassifyCompletedAction;