import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for removing response from collection.
 */
class UpdateStandardisationSetupResponseCollectionAction extends action {

    private _stdWorklistType: enums.StandardisationSetup;

    private _esMarkGroupId: number;

    /**
     * Constructor UpdateResponseAction
     */
    constructor(esMarkGroupId: number, stdWorklistType: enums.StandardisationSetup) {
        super(action.Source.View, actionType.DISCARD_STD_SETUP_RESPONSE_REMOVE_ACTION);
        this._stdWorklistType = stdWorklistType;
        this._esMarkGroupId = esMarkGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{esMarkGroupId}/g, esMarkGroupId.toString());
    }

    /**
     * return mark group id.
     */
    public get esMarkGroupID(): number {
        return this._esMarkGroupId;
    }

    /**
     * return worklist type.
     */
    public get standardisationdWorklistType(): enums.StandardisationSetup {
        return this._stdWorklistType;
    }
}

export = UpdateStandardisationSetupResponseCollectionAction;