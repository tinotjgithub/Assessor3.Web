import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for fetching the reclassify multi option popup display action.
 */
class ReclassifyMultiOptionPopupDisplayAction extends action {

    private _esMarkGroupId: number;
    private _isFromResponse: boolean;

    /**
     * Constructor for ReclassifyMultiOptionPopupDisplayAction
     */
    constructor(esMarkGroupId: number, isFromResponse: boolean) {
        super(action.Source.View, actionType.STANDARDISATION_RECLASSIFY_MULTI_OPTION_POPUP);
        this._esMarkGroupId = esMarkGroupId;
        this._isFromResponse = isFromResponse;
    }

    /**
     * Gets esMarkGroupId of response to be reclassfied.
     */
    public get reclassifiedEsMarkGroupId() {
        return this._esMarkGroupId;
    }

    /**
     * Gets a value indicating whether the action is from response.
     */
    public get isFromResponse() {
        return this._isFromResponse;
    }
}
export = ReclassifyMultiOptionPopupDisplayAction;