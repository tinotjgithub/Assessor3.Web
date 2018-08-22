"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkChangeReasonUpdateAction = (function (_super) {
    __extends(MarkChangeReasonUpdateAction, _super);
    /**
     * Constructor
     * @param markChangeReason
     */
    function MarkChangeReasonUpdateAction(markChangeReason) {
        _super.call(this, action.Source.View, actionType.MARK_CHANGE_REASON_UPDATE_ACTION);
        this._markChangeReason = markChangeReason;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', markChangeReason);
    }
    Object.defineProperty(MarkChangeReasonUpdateAction.prototype, "markChangeReason", {
        /**
         * Get markChangeReason
         */
        get: function () {
            return this._markChangeReason;
        },
        enumerable: true,
        configurable: true
    });
    return MarkChangeReasonUpdateAction;
}(action));
module.exports = MarkChangeReasonUpdateAction;
//# sourceMappingURL=markchangereasonupdateaction.js.map