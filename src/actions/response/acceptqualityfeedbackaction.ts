import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import acceptQualityFeedbackReturn = require('../../stores/response/typings/acceptqualityfeedbackreturn');
import enums = require('../../components/utility/enums');

class AcceptQualityFeedbackAction extends action {

    private _acceptQualityFeedbackActionData: acceptQualityFeedbackReturn;
    private _navigateTo: enums.SaveAndNavigate;
    private _navigateWorkListType: enums.WorklistType;

    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    constructor(data: acceptQualityFeedbackReturn, success: boolean, navigateTo: enums.SaveAndNavigate,
        navigateWorkListType: enums.WorklistType) {
        super(action.Source.View, actionType.ACCEPT_QUALITY_ACTION);
        this._acceptQualityFeedbackActionData = data;
        this._navigateTo = navigateTo;
        this._navigateWorkListType = navigateWorkListType;
    }

    public get acceptQualityFeedbackActionData(): acceptQualityFeedbackReturn {
        return this._acceptQualityFeedbackActionData;
    }

    /**
     * returns navigate to value
     */
    public get navigateTo(): number {
        return this._navigateTo;
    }

    public get navigateWorkListType(): enums.WorklistType {
        return this._navigateWorkListType;
    }
}
export = AcceptQualityFeedbackAction;