import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/** 
 * An error popup display to user whenever a save fail happen 
 * while updating es mrking mode concurrently by different users.
 */
class ConcurrentSaveFailInStmPopupAction extends action {

	// Flag to check if Standardisation Setup Completed.
    private _isStandardisationSetupCompleted: boolean;

    // Area from which the concurreny error occured
    private _area: enums.PageContainers;

    constructor(isStandardisationSetupCompleted: boolean, area: enums.PageContainers = enums.PageContainers.None) {
		super(action.Source.View, actionType.CONCURRENT_SAVE_FAILED);
        this._isStandardisationSetupCompleted = isStandardisationSetupCompleted;
        this._area = area;
	}

	/**
	 * Gets Standardisation Setup Completed.
	 */
	public get isStandardisationSetupCompleted() {
		return this._isStandardisationSetupCompleted;
    }

    /**
     * Gets area from which the concurreny error occured
     */
    public get area() {
        return this._area;
    }
}

export = ConcurrentSaveFailInStmPopupAction;
