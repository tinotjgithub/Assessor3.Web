"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for fetching the declassify popup display action.
 */
var ShareResponsePopupDisplayAction = (function (_super) {
    __extends(ShareResponsePopupDisplayAction, _super);
    /**
     * Constructor for ShareResponsePopupDisplayAction
     */
    function ShareResponsePopupDisplayAction(sharedResponseDetails) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SHARE_RESPONSE_POPUP);
        this._sharedResponseDetails = sharedResponseDetails;
    }
    Object.defineProperty(ShareResponsePopupDisplayAction.prototype, "sharedResponseDetails", {
        /**
         * return Shared Provisional Response details
         */
        get: function () {
            return this._sharedResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    return ShareResponsePopupDisplayAction;
}(action));
module.exports = ShareResponsePopupDisplayAction;
//# sourceMappingURL=shareresponsepopupdisplayaction.js.map