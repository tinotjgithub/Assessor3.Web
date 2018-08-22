import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for fetching the reclassify erro popup display action.
 */
class ReclassifyErrorPopupDisplayAction extends action {

    // Flag to check if reclassify action canceled.
	private _isReclassifyActionCanceled: boolean;
	// Flag to check if reclassify error or reorder error.
	private _isReclassify: boolean;
	private _displayId: string;

    /**
     * Constructor for ReclassifyErrorPopupDisplayAction
     */
	constructor(isReclassifyActionCanceled: boolean, isReclassify?: boolean, displayId?: string) {
        super(action.Source.View, actionType.STANDARDISATION_RECLASSIFY_ERROR_POPUP);
		this._isReclassifyActionCanceled = isReclassifyActionCanceled;
		this._isReclassify = isReclassify;
		this._displayId = displayId;
    }

    /**
     * Gets if reclassify action canceled.
     */
    public get isReclassifyActionCanceled() {
        return this._isReclassifyActionCanceled;
	}

	/**
	 * Gets if reclassify action canceled.
	 */
	public get isReclassify() {
		return this._isReclassify;
	}

	/**
	 * Gets display id.
	 */
	public get displayId() {
		return this._displayId;
	}
}
export = ReclassifyErrorPopupDisplayAction;