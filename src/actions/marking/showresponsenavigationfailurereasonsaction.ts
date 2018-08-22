import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import combinedWarningMessage = require('../../components/response/typings/combinedwarningmessage');

/**
 * Action class for setting marking in progress.
 */
class ShowResponseNavigationFailureReasonsAction extends action {

    private _combinedWarningMessage: combinedWarningMessage;

    private _navigatingTo: enums.SaveAndNavigate;

    private _navigatingFrom: enums.ResponseNavigation;

    /**
     * constructor
     * @param isMarkingInProgress
     */
    constructor(navigatingTo: enums.SaveAndNavigate, warningMessages: combinedWarningMessage,
        navigatingFrom?: enums.ResponseNavigation) {
        super(action.Source.View, actionType.SHOW_RESPONSE_NAVIGATION_FAILURE_REASON_ACTION);
        this._combinedWarningMessage = warningMessages;
        this._navigatingTo = navigatingTo;
        this._navigatingFrom = navigatingFrom;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', navigatingTo.toString());
    }

    /**
     * Get all response navigation failure reasons
     */
    public get combinedWarningMessage(): combinedWarningMessage {
        return this._combinedWarningMessage;
    }

    /**
     * get navigating to
     */
    public get navigatingTo(): enums.SaveAndNavigate {
        return this._navigatingTo;
    }

    /**
     * get navigating from
     */
    public get navigatingFrom(): enums.ResponseNavigation {
        return this._navigatingFrom;
    }
}

export = ShowResponseNavigationFailureReasonsAction;



