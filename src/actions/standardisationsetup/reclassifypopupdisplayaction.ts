import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import updateESMarkGroupMarkingModeData =
    require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Action class for fetching the reclassify popup display action.
 */
class ReclassifyPopupDisplayAction extends action {

    private _reclassifiedResponseDetails: updateESMarkGroupMarkingModeData;

    /**
     * Constructor for ReclassifyPopupDisplayAction
     */
    constructor(reclassifiedResponseDetails: updateESMarkGroupMarkingModeData) {
        super(action.Source.View, actionType.STANDARDISATION_RECLASSIFY_POPUP);
        this._reclassifiedResponseDetails = reclassifiedResponseDetails;
    }

    /**
     * Gets re classifed response details.
     */
    public get reclassifiedResponseDetails() {
        return this._reclassifiedResponseDetails;
    }
}
export = ReclassifyPopupDisplayAction;