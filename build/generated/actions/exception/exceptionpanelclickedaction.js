"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for setting LHS exception panel open status.
 */
var ExceptionPanelClickedAction = (function (_super) {
    __extends(ExceptionPanelClickedAction, _super);
    /**
     * Constructor Exception panel open status.
     * @param panelStatus
     */
    function ExceptionPanelClickedAction(panelStatus) {
        _super.call(this, action.Source.View, actionType.EXCEPTION_PANEL_CLICKED_ACTION);
        this._exceptionPanelOpen = panelStatus;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', panelStatus.toString());
    }
    Object.defineProperty(ExceptionPanelClickedAction.prototype, "isExceptionSidePanelOpen", {
        /**
         * returns exception panel open status.
         */
        get: function () {
            return this._exceptionPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    return ExceptionPanelClickedAction;
}(action));
module.exports = ExceptionPanelClickedAction;
//# sourceMappingURL=exceptionpanelclickedaction.js.map