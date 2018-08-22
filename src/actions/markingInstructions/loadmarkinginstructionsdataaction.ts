import dataRetrievalAction = require('../base/dataretrievalaction');
import action = require('../base/action');
import actionType = require('../base/actiontypes');

class LoadMarkingInstructionsDataAction extends dataRetrievalAction {
    private markingInstructionsList: Immutable.List<MarkingInstruction>;

    /**
     * Constructor of LoadMarkingInstructionsDataAction
     * @param success
     * @param markinginstructionsData
     */
    constructor(success: boolean, markingInstructionsList: Immutable.List<MarkingInstruction>) {
        super(action.Source.View, actionType.LOAD_MARKINGINSTRUCTIONS_DATA_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this.markingInstructionsList = markingInstructionsList;
    }
    /**
     * Retrieves markinginstructions data
     */
    public get markingInstructionsData(): Immutable.List<MarkingInstruction> {
        return this.markingInstructionsList;
    }
}

export = LoadMarkingInstructionsDataAction;

