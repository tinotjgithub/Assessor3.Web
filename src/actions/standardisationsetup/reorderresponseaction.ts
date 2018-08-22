import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');
import updateESMarkGroupMarkingModeData =
require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Action class for reordering response action.
 */
class ReOrderResponseAction extends dataRetrievalAction {

	private _reorderResponseDetails: updateESMarkGroupMarkingModeData;

    /**
     * Constructor for ReorderErrorPopupDisplayAction
     */
	constructor(success: boolean, reorderResponseDetails: updateESMarkGroupMarkingModeData) {
		super(action.Source.View, actionType.STANDARDISATION_REORDER_RESPONSE, success);
		this._reorderResponseDetails = reorderResponseDetails;
	}

    /**
     * Gets re ordered response details.
     */
	public get reorderResponseDetails() {
		return this._reorderResponseDetails;
	}
}
export = ReOrderResponseAction;