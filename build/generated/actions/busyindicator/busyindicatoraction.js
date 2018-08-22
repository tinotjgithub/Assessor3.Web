"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action to show busy indicator during submit
 */
var BusyIndicatorAction = (function (_super) {
    __extends(BusyIndicatorAction, _super);
    /**
     * Constructor for SubmitBusyIndicatorAction
     * @param busyIndicatorInvoker The busy indicator invoker
     */
    function BusyIndicatorAction(busyindicatorInvoker) {
        _super.call(this, action.Source.View, actionType.BUSY_INDICATOR);
        this._busyIndicatorInvoker = busyindicatorInvoker;
    }
    Object.defineProperty(BusyIndicatorAction.prototype, "getBusyIndicatorInvoker", {
        /**
         * Gets the busy indicator invoker
         */
        get: function () {
            return this._busyIndicatorInvoker;
        },
        enumerable: true,
        configurable: true
    });
    return BusyIndicatorAction;
}(action));
module.exports = BusyIndicatorAction;
//# sourceMappingURL=busyindicatoraction.js.map