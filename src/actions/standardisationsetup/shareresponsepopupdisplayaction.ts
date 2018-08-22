import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for fetching the declassify popup display action.
 */
class ShareResponsePopupDisplayAction extends action {

    private _sharedResponseDetails: StandardisationResponseDetails;
    private _isFromMarkScheme: boolean;

    /**
     * Constructor for ShareResponsePopupDisplayAction
     */
    constructor(sharedResponseDetails: StandardisationResponseDetails, fromMarkScheme: boolean) {
		super(action.Source.View, actionType.STANDARDISATION_SHARE_RESPONSE_POPUP);
        this._sharedResponseDetails = sharedResponseDetails;
        this._isFromMarkScheme = fromMarkScheme;
	}

    /**
     * return Shared Provisional Response details
     */
    public get sharedResponseDetails(): StandardisationResponseDetails {
        return this._sharedResponseDetails;
    }

    /**
     * return if PRovisional Response is shared from marking screen
     */
    public get isSharedFromMarkScheme(): boolean {
        return this._isFromMarkScheme;
    }
}
export = ShareResponsePopupDisplayAction;