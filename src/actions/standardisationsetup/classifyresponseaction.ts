import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');
import updateESMarkGroupMarkingModeData = require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Action class for fetching the classify response action.
 */
class ClassifyResponseAction extends dataRetrievalAction {

    private _classifiedResponseDetails: updateESMarkGroupMarkingModeData;
    /**
     * Constructor for classifyResponseAction
     */
    constructor(success: boolean, classifiedResponseDetails: updateESMarkGroupMarkingModeData) {
        super(action.Source.View, actionType.STANDARDISATION_CLASSIFY_RESPONSE_ACTION, success);
        this._classifiedResponseDetails = classifiedResponseDetails;
	}

    /**
     * Gets classifed response details.
     */
    public get classifiedResponseDetails() {
        return this._classifiedResponseDetails;
    }
}
export = ClassifyResponseAction;