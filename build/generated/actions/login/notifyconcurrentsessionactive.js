"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var NotifyConcurrentSessionActive = (function (_super) {
    __extends(NotifyConcurrentSessionActive, _super);
    /**
     * constructor
     */
    function NotifyConcurrentSessionActive() {
        _super.call(this, action.Source.View, actionType.NOTIFY_CONCURRENT_SESSION_ACTIVE);
    }
    return NotifyConcurrentSessionActive;
}(action));
module.exports = NotifyConcurrentSessionActive;
//# sourceMappingURL=notifyconcurrentsessionactive.js.map