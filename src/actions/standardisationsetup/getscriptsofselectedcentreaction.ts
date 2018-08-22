import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class GetScriptsOfSelectedCentreAction extends dataRetrievalAction {

    private _scriptList: StandardisationScriptDetailsList;
	private _selectedCentrePartId: number;
    private _selectedCentreId: number;
    private _isTriggeredFromResponseHeader: boolean;
    private _direction: enums.ResponseNavigation;

    /**
     * Constructor
     * @param success
     * @param centrePartId
     * @param centreId
     * @param navigationBetweenCentres
     * @param direction
     * @param json
     */
    constructor(success: boolean, centrePartId: number, centreId: number,
        navigationBetweenCentres: boolean, direction: enums.ResponseNavigation, json?: StandardisationScriptDetailsList) {
		super(action.Source.View, actionType.GET_SCRIPTS_OF_SELECTED_CENTRE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._scriptList = json;
		this._selectedCentrePartId = centrePartId;
        this._selectedCentreId = centreId;
        this._isTriggeredFromResponseHeader = navigationBetweenCentres;
        this._direction = direction;
    }

    /**
     * returns the script list, of the selected centre.
     */
    public get scriptListOfSelectedCentre(): StandardisationScriptDetailsList {
        return this._scriptList;
    }

    /**
     * returns the selected center part id.
     */
    public get selectedCentrePartId(): number {
        return this._selectedCentrePartId;
	}

    /**
     * returns the selected center id.
     */
	public get selectedCentreId(): number {
		return this._selectedCentreId;
    }

    /**
     * returns true, if its triggered on centre navigation.
     */
    public get isTriggeredFromResponseHeader(): boolean {
        return this._isTriggeredFromResponseHeader;
    }

    /*
     * return the direction.
     */
    public get direction(): enums.ResponseNavigation {
        return this._direction;
    }

}
export = GetScriptsOfSelectedCentreAction;
