"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var NavigateAfterMarkConfirmationAction = (function (_super) {
    __extends(NavigateAfterMarkConfirmationAction, _super);
    /**
     * Constructor
     * @param NavigateAfterMarkConfirmation
     */
    function NavigateAfterMarkConfirmationAction(navigateFrom, navigateTo) {
        _super.call(this, action.Source.View, actionType.NAVIGATE_AFTER_MARKING);
        this._navigateFrom = navigateFrom;
        this._navigateTo = navigateTo;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(NavigateAfterMarkConfirmationAction.prototype, "navigateFrom", {
        /* return the where its navigated from */
        get: function () {
            return this._navigateFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigateAfterMarkConfirmationAction.prototype, "navigateTo", {
        /* return the where its navigated from */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    return NavigateAfterMarkConfirmationAction;
}(action));
module.exports = NavigateAfterMarkConfirmationAction;
//# sourceMappingURL=navigateaftermarkconfirmationaction.js.map