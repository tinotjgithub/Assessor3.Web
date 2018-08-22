"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShowGracePeriodMessageAction = (function (_super) {
    __extends(ShowGracePeriodMessageAction, _super);
    /**
     * Constructor
     * @param failureReason
     */
    function ShowGracePeriodMessageAction(failureReason) {
        _super.call(this, action.Source.View, actionType.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE);
        this._failureReason = failureReason;
    }
    Object.defineProperty(ShowGracePeriodMessageAction.prototype, "failureReason", {
        get: function () {
            return this._failureReason;
        },
        enumerable: true,
        configurable: true
    });
    return ShowGracePeriodMessageAction;
}(action));
module.exports = ShowGracePeriodMessageAction;
//# sourceMappingURL=showgraceperiodmessageaction.js.map