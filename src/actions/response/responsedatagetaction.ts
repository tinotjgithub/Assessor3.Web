import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * The Action class for Response Data Get
 */
class ResponseDataGetAction extends action {

	private _searchedResponseData: SearchedResponseData;
    private _success: boolean = false;
    private _isSearchFromMenu: boolean = false;
    /**
     * Initializing a new instance of response search action.
     */
	constructor(searchedResponseData: SearchedResponseData, success: boolean, isSearchFromMenu: boolean = false) {
        super(action.Source.View, actionType.RESPONSE_DATA_GET_SEARCH);
        if (searchedResponseData) {
            this.auditLog.logContent = this.auditLog.logContent.replace(/{displayId}/g, searchedResponseData.displayId);
        } else {
            // If search response data is undefined then log failure status.
            this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        }
		this._searchedResponseData = searchedResponseData;
        this._success = success;
        this._isSearchFromMenu = isSearchFromMenu;
    }

    /**
     * Get the Searched Response Data
     */
    public get searchedResponseData(): SearchedResponseData {
        return this._searchedResponseData;
	}

	public get success(): boolean {
		return this._success;
    }

    /**
     * Get whether the search coming from menu
     */
    public get isSearchFromMenu(): boolean {
        return this._isSearchFromMenu;
    }
}

export = ResponseDataGetAction;