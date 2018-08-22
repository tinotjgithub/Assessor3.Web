"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShowReturnToWorklistConfirmationAction = (function (_super) {
    __extends(ShowReturnToWorklistConfirmationAction, _super);
    /**
     * Constructor
     */
    function ShowReturnToWorklistConfirmationAction() {
        _super.call(this, action.Source.View, actionType.SHOW_RETURN_TO_WORKLIST_CONFIRMATION_ACTION);
    }
    return ShowReturnToWorklistConfirmationAction;
}(action));
module.exports = ShowReturnToWorklistConfirmationAction;
//# sourceMappingURL=showreturntoworklistconfirmationaction.js.map