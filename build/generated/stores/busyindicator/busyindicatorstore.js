"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
/* The busy indicator store */
var BusyIndicatorStore = (function (_super) {
    __extends(BusyIndicatorStore, _super);
    /**
     * @constructor
     */
    function BusyIndicatorStore() {
        var _this = this;
        _super.call(this);
        this.dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === actionType.BUSY_INDICATOR) {
                _this.busyIndicatorInvoker = action.getBusyIndicatorInvoker;
                _this.emit(BusyIndicatorStore.BUSY_INDICATOR);
            }
        });
    }
    Object.defineProperty(BusyIndicatorStore.prototype, "getBusyIndicatorInvoker", {
        /**
         * Returns the busy indicator invoker
         * @returns
         */
        get: function () {
            return this.busyIndicatorInvoker;
        },
        enumerable: true,
        configurable: true
    });
    BusyIndicatorStore.BUSY_INDICATOR = 'setBusyIndicatorInvoker';
    return BusyIndicatorStore;
}(storeBase));
var instance = new BusyIndicatorStore();
module.exports = { BusyIndicatorStore: BusyIndicatorStore, instance: instance };
//# sourceMappingURL=busyindicatorstore.js.map