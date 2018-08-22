import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
/**
 * Action class for promote a response to seed
 */
class PromoteToReuseBucketAction extends dataRetrievalAction {

    // local variable for promote to seed.
    private _isResponePromotedToReuseBucket: boolean;
    private _markGroupId: number;
    private _isPromotedToReuseBucketSuccess: boolean;

    /**
     * Constructor
     * @param success
     * @param promoteToSeedReturn
     */
    constructor(success: boolean, isResponePromotedToReuseBucket: boolean, markGroupId: number) {
        super(action.Source.View, actionType.PROMOTE_TO_REUSE_BUCKET_ACTION, success);
        this._isResponePromotedToReuseBucket = isResponePromotedToReuseBucket;
        this._markGroupId = markGroupId;
        this._isPromotedToReuseBucketSuccess = success;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Promote to seed return object
     */
    public get isResponsePromotedToReuseBucket(): boolean {
        return this._isResponePromotedToReuseBucket;
    }

    /**
     * return selected response id.
     */
    public get markGroupId(): number {
        return this._markGroupId;
    }

    /**
     * We can't rely isResponsePromotedToReuseBucket variable to confirm whether the promotion is success or
     * not. As per the implementation if a server call is send it will treated as promoted to Reuse bucket untill
     * next login. Added success variable to handle offline scenario for defect #57340
     */
    public get isPromotedToReuseBucketSuccess(): boolean {
        return this._isPromotedToReuseBucketSuccess;
    }
}

export = PromoteToReuseBucketAction;
