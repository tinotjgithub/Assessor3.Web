import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import createStandardisationRIGReturn = require('../../stores/standardisationsetup/typings/createstandardisationrigreturn');

/**
 * Create ES Rig action
 */
class CreateStandardisationRigAction extends action {

    private createdStandardisationRIGReturnDetails: createStandardisationRIGReturn;
    private doMarkNow: boolean;

    /**
     * Constructor
     * @param success
     * @param resultData
     */
    constructor(success: boolean, resultData: createStandardisationRIGReturn, doMarkNow: boolean) {
        super(action.Source.View, actionType.CREATE_STANDARDISATION_RIG);
        this.createdStandardisationRIGReturnDetails = resultData;
        this.doMarkNow = doMarkNow;
    }

    public get errorInRigCreation(): boolean {
        let createRigError: enums.CreateRigError =
            this.createdStandardisationRIGReturnDetails.createStandardisationRIGReturnDetails.first().createRigError;
        return (createRigError === enums.CreateRigError.RigAllocated || createRigError === enums.CreateRigError.ScriptNotFound);
    }

    public get createdStandardisationRIGDetails(): createStandardisationRIGReturn {
        return this.createdStandardisationRIGReturnDetails;
    }

    public get isDoMarkNow(): boolean {
        return this.doMarkNow;
    }
}

export = CreateStandardisationRigAction;
