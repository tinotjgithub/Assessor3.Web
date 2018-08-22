"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action for updating message priority
 */
var UpdateMessagePriorityAction = (function (_super) {
    __extends(UpdateMessagePriorityAction, _super);
    /**
     * constructor for the action object
     */
    function UpdateMessagePriorityAction() {
        _super.call(this, action.Source.View, actionType.UPDATE_MESSAGE_PRIORITY_ACTION);
    }
    return UpdateMessagePriorityAction;
}(action));
module.exports = UpdateMessagePriorityAction;
//# sourceMappingURL=updatemessagepriorityaction.js.map