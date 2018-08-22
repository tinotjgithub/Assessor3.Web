import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import standardisationTargetDetails = require('../../stores/standardisationsetup/typings/standardisationtargetdetails');

class GetStandardisationTargetDetailsListAction extends dataRetrievalAction {

    private _standardisationTargetDetails: standardisationTargetDetails;
    private _markSchemeGroupId: number;
    private _examinerRoleId: number;
    /**
     * Constructor
     * @param success
     * @param json
     */
    constructor(success: boolean,
        markSchemeGroupId: number, examinerRoleId: number, json?: standardisationTargetDetails) {
        super(action.Source.View, actionType.GET_STANDARDISATION_TARGET_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._markSchemeGroupId = markSchemeGroupId;
        this._examinerRoleId = examinerRoleId;
        this._standardisationTargetDetails = json;
    }

    /**
     * returns the StandardisationTargetDetails
     */
    public get StandardisationTargetDetailsList(): standardisationTargetDetails {
        return this._standardisationTargetDetails;
    }

    /**
     * mark scheme group id
     */
    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }

    /**
     * examiner role id
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }
}

export = GetStandardisationTargetDetailsListAction;
