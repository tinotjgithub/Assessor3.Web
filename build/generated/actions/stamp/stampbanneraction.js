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
 * class for stamp banner action
 */
var StampBannerAction = (function (_super) {
    __extends(StampBannerAction, _super);
    /**
     * constructor
     * @param success
     * @param stampBannerType
     * @param isStampBannerVisible
     */
    function StampBannerAction(success, stampBannerType, isStampBannerVisible) {
        _super.call(this, action.Source.View, actionType.UPDATE_STAMP_BANNER_VISIBILITY, success);
        this._stampBannerActionType = stampBannerType;
        this._isStampBannerVisible = isStampBannerVisible;
    }
    Object.defineProperty(StampBannerAction.prototype, "stampBannerType", {
        /**
         * Returns the stamp banner type.
         */
        get: function () {
            return this._stampBannerActionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampBannerAction.prototype, "isStampBannerVisible", {
        /**
         * Returns the stamp banner visibility.
         */
        get: function () {
            return this._isStampBannerVisible;
        },
        enumerable: true,
        configurable: true
    });
    return StampBannerAction;
}(dataRetrievalAction));
module.exports = StampBannerAction;
//# sourceMappingURL=stampbanneraction.js.map