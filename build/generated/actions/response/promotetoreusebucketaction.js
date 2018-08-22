"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Action class for promote a response to seed
 */
var PromoteToReuseBucketAction = (function (_super) {
    __extends(PromoteToReuseBucketAction, _super);
    /**
     * Constructor
     * @param success
     * @param promoteToSeedReturn
     */
    function PromoteToReuseBucketAction(success, isResponePromotedToReuseBucket, markGroupId) {
        _super.call(this, action.Source.View, actionType.PROMOTE_TO_REUSE_BUCKET_ACTION, success);
        this._isResponePromotedToReuseBucket = isResponePromotedToReuseBucket;
        this._markGroupId = markGroupId;
        this._isPromotedToReuseBucketSuccess = success;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(PromoteToReuseBucketAction.prototype, "isResponsePromotedToReuseBucket", {
        /**
         * Promote to seed return object
         */
        get: function () {
            return this._isResponePromotedToReuseBucket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromoteToReuseBucketAction.prototype, "markGroupId", {
        /**
         * return selected response id.
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromoteToReuseBucketAction.prototype, "isPromotedToReuseBucketSuccess", {
        /**
         * We can't rely isResponsePromotedToReuseBucket variable to confirm whether the promotion is success or
         * not. As per the implementation if a server call is send it will treated as promoted to Reuse bucket untill
         * next login. Added success variable to handle offline scenario for defect #57340
         */
        get: function () {
            return this._isPromotedToReuseBucketSuccess;
        },
        enumerable: true,
        configurable: true
    });
    return PromoteToReuseBucketAction;
}(dataRetrievalAction));
module.exports = PromoteToReuseBucketAction;
//# sourceMappingURL=promotetoreusebucketaction.js.map