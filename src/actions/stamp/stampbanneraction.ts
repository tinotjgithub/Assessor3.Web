import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stampList = require('../../stores/stamp/typings/stamplist');
import enums = require('../../components/utility/enums');

/**
 * class for stamp banner action
 */
class StampBannerAction extends dataRetrievalAction {

    private _stampBannerActionType: enums.BannerType;
    private _isStampBannerVisible: boolean;

    /**
     * constructor
     * @param success
     * @param stampBannerType
     * @param isStampBannerVisible
     */
    constructor(success: boolean, stampBannerType: enums.BannerType, isStampBannerVisible: boolean) {
        super(action.Source.View, actionType.UPDATE_STAMP_BANNER_VISIBILITY, success);
        this._stampBannerActionType = stampBannerType;
        this._isStampBannerVisible = isStampBannerVisible;
    }

   /**
    * Returns the stamp banner type.
    */
    public get stampBannerType(): enums.BannerType {
        return this._stampBannerActionType;
    }

   /**
    * Returns the stamp banner visibility.
    */
    public get isStampBannerVisible(): boolean {
        return this._isStampBannerVisible;
    }
}

export = StampBannerAction;


