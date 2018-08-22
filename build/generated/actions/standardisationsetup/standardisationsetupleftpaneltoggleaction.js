"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action for Standardisation setup Left Panel Toggle Save
 */
var StandardisationSetupLeftPanelToggleAction = (function (_super) {
    __extends(StandardisationSetupLeftPanelToggleAction, _super);
    /**
     * Constructor for the leftpanel toggle action
     * @param isLeftPanelCollapsed boolean value indicating whether the panel is in collapsed state or not.
     */
    function StandardisationSetupLeftPanelToggleAction(isLeftPanelCollapsed) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SETUP_LEFT_PANEL_TOGGLE);
        this._isLeftPanelCollapsed = isLeftPanelCollapsed;
        this.auditLog.logContent = this.auditLog.logContent.replace('{UserAction}', isLeftPanelCollapsed ? 'Hide Panel' : 'Show Panel');
    }
    Object.defineProperty(StandardisationSetupLeftPanelToggleAction.prototype, "isLeftPanelCollapsed", {
        /**
         * Gets the left panel collapsed status
         */
        get: function () {
            return this._isLeftPanelCollapsed;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationSetupLeftPanelToggleAction;
}(action));
module.exports = StandardisationSetupLeftPanelToggleAction;
//# sourceMappingURL=standardisationsetupleftpaneltoggleaction.js.map