import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');

/**
 * The Action class to save and navigate.
 */
class SaveAndNavigateAction extends action {

    /**
     *  Navigating from response to different view
     */
    private _navigatingTo: enums.SaveAndNavigate;

    /**
     *  Navigating by clicking the navigation or navigation from markscheme
     */
    private _navigationFrom: enums.ResponseNavigation;

    /**
     *  Checking whether we need to shoe the popup.
     */

    private _showNavigationOnMbqPopup: boolean = false;

    /**
     * Initializing a new instance of save and navigate class.
     * @param navigatingTo
     * @param navigationFrom
     */
    constructor(navigatingTo: enums.SaveAndNavigate, navigationFrom?: enums.ResponseNavigation, showNavigationOnMbqPopup?: boolean) {
        super(action.Source.View, actionType.SAVE_AND_NAVIGATE);
        this._navigatingTo = navigatingTo;
        this._navigationFrom = navigationFrom;
        this._showNavigationOnMbqPopup = showNavigationOnMbqPopup;

        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{navigatingTo}/g, navigatingTo.toString()).
            replace(/{navigatingFrom}/g, navigationFrom === undefined ? 'undefined' : navigationFrom.toString());
    }

    /**
     * Navigating from response to different view
     */
    public get navigatingTo(): enums.SaveAndNavigate {
        return this._navigatingTo;
    }

    /* return where the navigations happens */
    public get navigationFrom(): enums.ResponseNavigation {
        return this._navigationFrom;
    }

    /* return the value when the response reach the last question item of the last response. */
    public get showNavigationOnMbqPopup(): boolean {
        return this._showNavigationOnMbqPopup;
    }
}
export = SaveAndNavigateAction;