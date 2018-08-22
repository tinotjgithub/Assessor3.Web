"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action for updating message priority
 */
var MandatoryMessageValidationPopupAction = (function (_super) {
    __extends(MandatoryMessageValidationPopupAction, _super);
    /**
     * constructor for the action object
     */
    function MandatoryMessageValidationPopupAction(isDisplay) {
        _super.call(this, action.Source.View, actionType.MANDATORY_MESSAGE_VALIDATION_POPUP_ACTION);
        this._isDisplay = isDisplay;
    }
    Object.defineProperty(MandatoryMessageValidationPopupAction.prototype, "isDisplay", {
        /**
         * Get isDisplay value
         */
        get: function () {
            return this._isDisplay;
        },
        enumerable: true,
        configurable: true
    });
    return MandatoryMessageValidationPopupAction;
}(action));
module.exports = MandatoryMessageValidationPopupAction;
//# sourceMappingURL=mandatorymessagevalidationpopupaction.js.map