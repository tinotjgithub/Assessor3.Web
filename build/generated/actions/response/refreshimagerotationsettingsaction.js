"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var RefreshImageRotationSettingsAction = (function (_super) {
    __extends(RefreshImageRotationSettingsAction, _super);
    /**
     * Initialise a new instance of RefreshImageRotationSettingsAction
     */
    function RefreshImageRotationSettingsAction() {
        _super.call(this, action.Source.View, actionType.REFRESH_IMAGE_ROTATION_SETTINGS);
    }
    return RefreshImageRotationSettingsAction;
}(action));
module.exports = RefreshImageRotationSettingsAction;
//# sourceMappingURL=refreshimagerotationsettingsaction.js.map