"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for fetching the reclassify erro popup display action.
 */
var ReclassifyErrorPopupDisplayAction = (function (_super) {
    __extends(ReclassifyErrorPopupDisplayAction, _super);
    /**
     * Constructor for ReclassifyErrorPopupDisplayAction
     */
    function ReclassifyErrorPopupDisplayAction(isReclassifyActionCanceled, isReclassify, displayId) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_RECLASSIFY_ERROR_POPUP);
        this._isReclassifyActionCanceled = isReclassifyActionCanceled;
        this._isReclassify = isReclassify;
        this._displayId = displayId;
    }
    Object.defineProperty(ReclassifyErrorPopupDisplayAction.prototype, "isReclassifyActionCanceled", {
        /**
         * Gets if reclassify action canceled.
         */
        get: function () {
            return this._isReclassifyActionCanceled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReclassifyErrorPopupDisplayAction.prototype, "isReclassify", {
        /**
         * Gets if reclassify action canceled.
         */
        get: function () {
            return this._isReclassify;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReclassifyErrorPopupDisplayAction.prototype, "displayId", {
        /**
         * Gets display id.
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    return ReclassifyErrorPopupDisplayAction;
}(action));
module.exports = ReclassifyErrorPopupDisplayAction;
//# sourceMappingURL=reclassifyerrorpopupdisplayaction.js.map