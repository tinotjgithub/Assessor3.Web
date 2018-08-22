"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Reject rig popup display action.
 */
var RejectRigPopUpDisplayAction = (function (_super) {
    __extends(RejectRigPopUpDisplayAction, _super);
    /**
     * Constructor RejectRig pop up display action
     */
    function RejectRigPopUpDisplayAction() {
        _super.call(this, action.Source.View, actionType.REJECT_RIG_POPUP_DISPLAY_ACTION);
    }
    return RejectRigPopUpDisplayAction;
}(action));
module.exports = RejectRigPopUpDisplayAction;
//# sourceMappingURL=rejectrigpopupdisplayaction.js.map