"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for FRV toggle button.
 */
var FullResponseViewToggleButtonAction = (function (_super) {
    __extends(FullResponseViewToggleButtonAction, _super);
    /**
     * Initializing a new instance of FRV Toggle button action.
     */
    function FullResponseViewToggleButtonAction() {
        _super.call(this, action.Source.View, actionType.FRV_TOGGLE_BUTTON_ACTION);
    }
    return FullResponseViewToggleButtonAction;
}(action));
module.exports = FullResponseViewToggleButtonAction;
//# sourceMappingURL=frvtoggleaction.js.map