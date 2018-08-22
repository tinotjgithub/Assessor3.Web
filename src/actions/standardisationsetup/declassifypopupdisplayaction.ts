import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import updateESMarkGroupMarkingModeData =
require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Action class for fetching the declassify popup display action.
 */
class DeclassifyPopupDisplayAction extends action {

	private _declassifiedResponseDetails: updateESMarkGroupMarkingModeData;

    /**
     * Constructor for DeclassifyPopupDisplayAction
     */
    constructor(declassifiedResponseDetails: updateESMarkGroupMarkingModeData) {
		super(action.Source.View, actionType.STANDARDISATION_DECLASSIFY_POPUP);
        this._declassifiedResponseDetails = declassifiedResponseDetails;
	}

    /**
     * Gets display id
     */
    public get declassifiedResponseDetails() {
        return this._declassifiedResponseDetails;
	}
}
export = DeclassifyPopupDisplayAction;