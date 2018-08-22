"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for Stamp Panel Action
 */
var StampPanelAction = (function (_super) {
    __extends(StampPanelAction, _super);
    /**
     * Constructor StampPanelAction
     * @param isStampPanelExpanded
     */
    function StampPanelAction(isStampPanelExpanded) {
        _super.call(this, action.Source.View, actionType.STAMP_PANEL_MODE_CHANGED);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, 'true');
        this._isStampPanelExpanded = isStampPanelExpanded;
    }
    Object.defineProperty(StampPanelAction.prototype, "isStampPanelExpanded", {
        /**
         * This method will return whether the stamp panel is expanded/collapsed
         */
        get: function () {
            return this._isStampPanelExpanded;
        },
        enumerable: true,
        configurable: true
    });
    return StampPanelAction;
}(action));
module.exports = StampPanelAction;
//# sourceMappingURL=stamppanelaction.js.map