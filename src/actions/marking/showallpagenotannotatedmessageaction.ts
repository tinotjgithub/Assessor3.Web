import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The Action class to display all page not annotated popup.
 */
class ShowAllPageNotAnnotatedMessageAction extends action {     /*  Navigate to different view */
    private _navigatingTo: enums.SaveAndNavigate;

    /**
     * Constructor
     * @param navigatingTo
     */
    constructor(navigatingTo: enums.SaveAndNavigate) {
        super(action.Source.View, actionType.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE);
        this._navigatingTo = navigatingTo;
    }

    /**
     * Navigating from response to different view
     */
    public get navigatingTo(): enums.SaveAndNavigate {
        return this._navigatingTo;
    }
}

export = ShowAllPageNotAnnotatedMessageAction;