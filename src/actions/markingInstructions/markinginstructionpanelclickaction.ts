import action = require('../base/action');
import actionType = require('../base/actiontypes');

class MarkingInstructionPanelClickAction extends action {
    private _isMarkingInstructionPanelOpen: boolean = false;

    /**
     * Constructor of LoadMarkingInstructionsDataAction
     * @param success
     * @param markinginstructionsData
     */
    constructor(isMarkingInstructionPanelOpen: boolean) {
        super(action.Source.View, actionType.MARKING_INSTRUCTION_PANEL_CLICK_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ state}/g, isMarkingInstructionPanelOpen.toString());
        this._isMarkingInstructionPanelOpen = isMarkingInstructionPanelOpen;
    }

    /**
     * Retrieves markinginstruction panel open or not
     */
    public get isMarkingInstructionPanelOpen(): boolean {
        return this._isMarkingInstructionPanelOpen;
    }
}

export = MarkingInstructionPanelClickAction;

