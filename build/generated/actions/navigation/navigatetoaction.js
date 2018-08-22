"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var NavigateToAction = (function (_super) {
    __extends(NavigateToAction, _super);
    /**
     * Constructor
     * @param fragment
     */
    function NavigateToAction(fragment) {
        _super.call(this, action.Source.View, actionType.NAVIGATE_TO);
        this._fragment = fragment;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{url}/g, fragment);
    }
    Object.defineProperty(NavigateToAction.prototype, "getFragment", {
        get: function () {
            return this._fragment;
        },
        enumerable: true,
        configurable: true
    });
    return NavigateToAction;
}(action));
module.exports = NavigateToAction;
//# sourceMappingURL=navigatetoaction.js.map