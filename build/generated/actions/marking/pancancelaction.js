"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var PanCancelAction = (function (_super) {
    __extends(PanCancelAction, _super);
    function PanCancelAction() {
        _super.call(this, action.Source.View, actionType.PAN_CANCEL_ACTION);
    }
    return PanCancelAction;
}(action));
module.exports = PanCancelAction;
//# sourceMappingURL=pancancelaction.js.map