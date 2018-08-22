"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for navigation from message panel
 */
var MessageNavigateAction = (function (_super) {
    __extends(MessageNavigateAction, _super);
    /**
     * constructor
     */
    function MessageNavigateAction(messageNavigationArgument) {
        _super.call(this, action.Source.View, actionType.MESSAGE_NAVIGATE_ACTION);
        this._messageNavigationArguments = messageNavigationArgument;
    }
    Object.defineProperty(MessageNavigateAction.prototype, "messageNavigationArguments", {
        /**
         * return the navigation arguments needed
         */
        get: function () {
            return this._messageNavigationArguments;
        },
        enumerable: true,
        configurable: true
    });
    return MessageNavigateAction;
}(action));
module.exports = MessageNavigateAction;
//# sourceMappingURL=messagenavigateaction.js.map