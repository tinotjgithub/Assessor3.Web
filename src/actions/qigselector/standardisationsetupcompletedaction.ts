import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class StandardisationSetupCompletedAction extends dataRetrievalAction{

    private _isStandardisationSetupCompleted: boolean;
    private _navigatedFrom: enums.PageContainers;
    private _navigatedTo: enums.PageContainers;

    /**
     * Constructor for standardisation setup completion
     * @param success
     * @param isStandardisationSetupCompleted
     * @param navigatedFrom
     * @param navigatedTo
     */
    constructor(success: boolean, isStandardisationSetupCompleted: boolean,
        navigatedFrom: enums.PageContainers,
        navigatedTo: enums.PageContainers) {
        super(action.Source.View, actionType.STANDARDISATION_SETUP_COMPLETED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isStandardisationSetupCompleted = isStandardisationSetupCompleted;
        this._navigatedFrom = navigatedFrom;
        this._navigatedTo = navigatedTo;
    }

    /**
     * Checking whether the standardisation setup is completed or not
     */
    public get isStandardisationSetupCompleted(): boolean {
        return this._isStandardisationSetupCompleted;
    }

    /**
     * Gets the container from which navigation happened
     */
    public get navigatedFrom(): enums.PageContainers {
        return this._navigatedFrom;
    }

    /**
     * Gets the container to navigate to
     */
    public get navigatedTo(): enums.PageContainers {
        return this._navigatedTo;
    }
}

export = StandardisationSetupCompletedAction;