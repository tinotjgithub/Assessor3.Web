import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import loadMarkingInstructionsDataAction = require('../../actions/markinginstructions/loadmarkinginstructionsdataaction');
import markingInstructionPanelClickAction = require('../../actions/markinginstructions/markinginstructionpanelclickaction');
import markingInstructionUpdatedAction = require('../../actions/markinginstructions/markingInstructionUpdatedAction');

/**
 * Class for Marking Instruction store
 */
class MarkingInstructionStore extends storeBase {

    public static MARKINGINSTRUCTIONS_DATA_LOADED_EVENT = 'markinginstructionsdataloadedevent';
    public static MARKINGINSTRUCTION_PANEL_CLOSED_EVENT = 'markinginstructionpanelclickedevent';

    private _markinginstructionsList: Immutable.List<MarkingInstruction>;

    private _isMarkingInstructionPanelOpen: boolean = false;
    private _markingInstructionPanelPreviousState: boolean = false;

    /**
     * @constructor
     */
    constructor() {
        super();
        this._dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.LOAD_MARKINGINSTRUCTIONS_DATA_ACTION:
                    let _loadmarkinginstructionsdataaction = action as loadMarkingInstructionsDataAction;
                    this._markinginstructionsList = _loadmarkinginstructionsdataaction.markingInstructionsData;
                    this.emit(MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT);
                    break;
                case actionType.MARKING_INSTRUCTION_PANEL_CLICK_ACTION:
                    this._markingInstructionPanelPreviousState = this._isMarkingInstructionPanelOpen;
                    this._isMarkingInstructionPanelOpen = (action as markingInstructionPanelClickAction).isMarkingInstructionPanelOpen;
                    if (!this._isMarkingInstructionPanelOpen &&
                        this._markingInstructionPanelPreviousState !== this._isMarkingInstructionPanelOpen) {
                        // emit only if the action is closing and check the previous action action to avoid multiple emits of same action
                        this.emit(MarkingInstructionStore.MARKINGINSTRUCTION_PANEL_CLOSED_EVENT);
                    }
                    break;
                case actionType.MARKING_INSTRUCTION_UPDATED_ACTION:
                    let _markingInstructionUpdatedAction = action as markingInstructionUpdatedAction;
                    this.updateMarkingInstruction(_markingInstructionUpdatedAction.documentId, _markingInstructionUpdatedAction.readStatus);
                    break;
            }
        });
    }

    /**
     * Gets the marking instruction list
     */
    public get markingInstructionList(): Immutable.List<MarkingInstruction> {
        return this._markinginstructionsList;
    }

    /**
     * Gets is marking instruction panel is open or not
     */
    public get isMarkingInstructionPanelOpen(): boolean {
        return this._isMarkingInstructionPanelOpen;
    }

    /**
     * Update the marking instruction list
     */
    private updateMarkingInstruction(documentId: number, readStatus: boolean) {
        let markingInstruction: MarkingInstruction = this.markingInstructionList.find(x => x.documentId === documentId);
        if (markingInstruction != null && !readStatus) {
            markingInstruction.readStatus = true;
            this.emit(MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT);
        }
    }
}
let instance = new MarkingInstructionStore();
export = { MarkingInstructionStore, instance };
