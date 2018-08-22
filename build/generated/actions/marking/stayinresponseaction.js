"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for disabling mbq popup.
 */
var StayInResponseAction = (function (_super) {
    __extends(StayInResponseAction, _super);
    function StayInResponseAction() {
        _super.call(this, action.Source.View, actionType.STAY_IN_RESPONSE_ACTION);
    }
    return StayInResponseAction;
}(action));
module.exports = StayInResponseAction;
//# sourceMappingURL=stayinresponseaction.js.map