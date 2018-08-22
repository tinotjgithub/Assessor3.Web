"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to display Marke Change Reason Needed popup.
 */
var SetMarkChangeReasonVisibilityAction = (function (_super) {
    __extends(SetMarkChangeReasonVisibilityAction, _super);
    /**
     * Constructor
     * @param isMarkChangeReasonVisible
     */
    function SetMarkChangeReasonVisibilityAction(isMarkChangeReasonVisible) {
        _super.call(this, action.Source.View, actionType.SET_MARK_CHANGE_REASON_VISIBILITY_ACTION);
        this._isMarkChangeReasonVisible = isMarkChangeReasonVisible;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(SetMarkChangeReasonVisibilityAction.prototype, "isMarkChangeReasonVisible", {
        /**
         * mark change reason visibility
         */
        get: function () {
            return this._isMarkChangeReasonVisible;
        },
        enumerable: true,
        configurable: true
    });
    return SetMarkChangeReasonVisibilityAction;
}(action));
module.exports = SetMarkChangeReasonVisibilityAction;
//# sourceMappingURL=setmarkchangereasonvisibilityaction.js.map