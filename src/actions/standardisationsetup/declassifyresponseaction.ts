import action = require('../base/action');
import actionType = require('../base/actiontypes');
import updateESMarkGroupMarkingModeData =
require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Action class for declassify the response.
 */
class DeclassifyResponseAction extends action {

	private _isDeclassifiedResponse: boolean;
	private _candidateScriptId: number;
	private _markingModeId: number;
    private _rigOrder: number;

	/**
	 * Constructor for DeclassifyResponseAction
	 * @param success
	 */
    constructor(success: boolean, declassifyResponseDetails: updateESMarkGroupMarkingModeData) {
		super(action.Source.View, actionType.STANDARDISATION_DECLASSIFY_RESPONSE);
		this._isDeclassifiedResponse = success;
        this._candidateScriptId = declassifyResponseDetails.candidateScriptId;
		this._markingModeId = declassifyResponseDetails.previousMarkingModeId;
        this._rigOrder = declassifyResponseDetails.rigOrder;
	}

	/**
	 * Gets whether the response is declassified or not.
	 */
	public get isDeclassifiedResponse() {
		return this._isDeclassifiedResponse;
	}

	/**
	 * Gets candidate script id value
	 */
	public get candidateScriptId() {
		return this._candidateScriptId;
	}

	/**
	 * Gets marking mode id value
	 */
	public get markingModeId() {
		return this._markingModeId;
	}

	/**
	 * Gets rig order value
	 */
	public get rigOrder() {
		return this._rigOrder;
    }
}
export = DeclassifyResponseAction;