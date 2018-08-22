import action = require('../base/action');
import actionType = require('../base/actiontypes');
import standardisationCentreScriptFilterDetails = require('../../components/utility/grid/standardisationcentrescriptfilterdetails');

/**
 * Action class for storing the standardisation centre script filter.
 */
class StandardisationCentreScriptFilterAction extends action {

    private _standardisationCentreScriptFilterDetails: standardisationCentreScriptFilterDetails;

    /**
     * Constructor for StandardisationCentreScriptFilterAction
     */
    constructor(standardisationCentreScriptFilterDetails: standardisationCentreScriptFilterDetails) {
        super(action.Source.View, actionType.STANDARDISATION_CENTRE_SCRIPT_FILTER);
        this._standardisationCentreScriptFilterDetails = standardisationCentreScriptFilterDetails;
    }

    /**
     * Gets standardisation centre script filter details
     */
    public get getStandardisationCentreScriptFilterDetails() {
        return this._standardisationCentreScriptFilterDetails;
    }
}
export = StandardisationCentreScriptFilterAction;