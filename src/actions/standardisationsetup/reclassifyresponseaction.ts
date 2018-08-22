import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');
import updateESMarkGroupMarkingModeData = require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Action class for fetching the reclassify response action.
 */
class ReclassifyResponseAction extends dataRetrievalAction {

    private _reclassifiedResponseDetails: updateESMarkGroupMarkingModeData;

    /**
     * Constructor for ReclassifyResponseAction
     */
    constructor(success: boolean, reclassifiedResponseDetails: updateESMarkGroupMarkingModeData) {
        super(action.Source.View, actionType.STANDARDISATION_RECLASSIFY_RESPONSE, success);
        this._reclassifiedResponseDetails = reclassifiedResponseDetails;
	}

    /**
     * Gets re classifed response details.
     */
    public get reclassifiedResponseDetails() {
        return this._reclassifiedResponseDetails;
    }
}
export = ReclassifyResponseAction;