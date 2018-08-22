import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');
import enums = require('../../components/utility/enums');

class GetStandardisationResponseDetailsAction extends dataRetrievalAction {

    private _standardisationResponseDetails: StandardisationSetupResponsedetailsList;
    private _isTotalMarksViewSelected: boolean;
    private _worklistType: enums.StandardisationSetup;
    private _markSchemeGroupId: number;
    /**
     * Constructor
     * @param success
     * @param json
     */
    constructor(success: boolean, worklistViewType: enums.STDWorklistViewType, json?:
        StandardisationSetupResponsedetailsList, fromCache?: boolean,
        worklistType?: enums.StandardisationSetup, markSchemeGroupId?: number) {
        super(action.Source.View, actionType.GET_STANDARDISATION_RESPONSE_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._worklistType = worklistType;
        this._markSchemeGroupId = markSchemeGroupId;
        this._standardisationResponseDetails = json;
        this._isTotalMarksViewSelected =
            worklistViewType === enums.STDWorklistViewType.ViewTotalMarks ? true : false;
    }

    /**
     * returns the ClassifiedResponseDetails
     */
    public get StandardisationResponseDetails(): StandardisationSetupResponsedetailsList {
        return this._standardisationResponseDetails;
    }

    /**
     * returns whether is total marks view selected
     */
    public get isTotalMarksViewSelected(): boolean {
        return this._isTotalMarksViewSelected;
    }

    /**
     * returns standardsation worklist type.
     */
    public get standardisationWorklistType(): enums.StandardisationSetup {
        return this._worklistType;
    }

    /**
     * Returns markscheme group id.
     */
    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }
}

export = GetStandardisationResponseDetailsAction;