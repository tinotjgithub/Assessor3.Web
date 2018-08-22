"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
/**
 * Warning Message store
 */
var WarningMessageStore = (function (_super) {
    __extends(WarningMessageStore, _super);
    /**
     * @constructor
     */
    function WarningMessageStore() {
        var _this = this;
        _super.call(this);
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.WARNING_MESSAGE_ACTION:
                    var validateAction = action;
                    _this.emit(WarningMessageStore.WARNING_MESSAGE_EVENT, validateAction.failureCode, validateAction.warningMessageAction);
                    break;
                case actionType.WARNING_MESSAGE_NAVIGATION_ACTION:
                    var navigationAction = action;
                    _this.emit(WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, navigationAction.failureCode, navigationAction.warningMessageAction);
                    break;
            }
        });
    }
    // Warning message event
    WarningMessageStore.WARNING_MESSAGE_EVENT = 'warningessageevent';
    // Warning message event
    WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT = 'warningessagenavigationevent';
    return WarningMessageStore;
}(storeBase));
var instance = new WarningMessageStore();
module.exports = { WarningMessageStore: WarningMessageStore, instance: instance };
//# sourceMappingURL=warningmessagestore.js.map