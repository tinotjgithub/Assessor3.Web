"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for setting LHS  message panel open status.
 */
var MessagePanelClickedAction = (function (_super) {
    __extends(MessagePanelClickedAction, _super);
    /**
     * Constructor Message panel open status.
     * @param panelStatus
     */
    function MessagePanelClickedAction(panelStatus) {
        _super.call(this, action.Source.View, actionType.MESSAGE_PANEL_CLICKED_ACTION);
        this._messagePanelStatus = panelStatus;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', panelStatus.toString());
    }
    Object.defineProperty(MessagePanelClickedAction.prototype, "isMessageSidePanelOpen", {
        /**
         * returns message panel open status.
         */
        get: function () {
            return this._messagePanelStatus;
        },
        enumerable: true,
        configurable: true
    });
    return MessagePanelClickedAction;
}(action));
module.exports = MessagePanelClickedAction;
//# sourceMappingURL=messagepanelclickedaction.js.map