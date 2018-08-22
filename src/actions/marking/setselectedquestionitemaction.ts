import action = require('../base/action');
import actionType = require('../base/actiontypes');
/**
 * Action class setting selected question item index
 */
class SetSelectedQuestionItemAction extends action {

    // selected question item index
	private _selectedQuestionItemIndex: number = 0;
	private _selectedQuestionItemUniqueId: number = 0;

    /**
     * constructor
     * @param set selected question item index
     */
    constructor(index: number, uniqueId: number) {
        super(action.Source.View, actionType.SET_SELECTED_QUESTION_ITEM_ACTION);
		this._selectedQuestionItemIndex = index;
		this._selectedQuestionItemUniqueId = uniqueId;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', index.toString());
    }

    /* return the selected question item index */
    public get getSelectedQuestionItemIndex(): number {
        return this._selectedQuestionItemIndex;
	}

	public get getSelectedQuestionItemUniqueId(): number {
		return this._selectedQuestionItemUniqueId;
	}
}

export = SetSelectedQuestionItemAction;