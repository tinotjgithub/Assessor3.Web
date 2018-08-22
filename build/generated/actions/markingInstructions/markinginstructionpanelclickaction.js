"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkingInstructionPanelClickAction = (function (_super) {
    __extends(MarkingInstructionPanelClickAction, _super);
    /**
     * Constructor of LoadMarkingInstructionsDataAction
     * @param success
     * @param markinginstructionsData
     */
    function MarkingInstructionPanelClickAction(isMarkingInstructionPanelOpen) {
        _super.call(this, action.Source.View, actionType.MARKING_INSTRUCTION_PANEL_CLICK_ACTION);
        this._isMarkingInstructionPanelOpen = false;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ state}/g, isMarkingInstructionPanelOpen.toString());
        this._isMarkingInstructionPanelOpen = isMarkingInstructionPanelOpen;
    }
    Object.defineProperty(MarkingInstructionPanelClickAction.prototype, "isMarkingInstructionPanelOpen", {
        /**
         * Retrieves markinginstruction panel open or not
         */
        get: function () {
            return this._isMarkingInstructionPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    return MarkingInstructionPanelClickAction;
}(action));
module.exports = MarkingInstructionPanelClickAction;
//# sourceMappingURL=markinginstructionpanelclickaction.js.map