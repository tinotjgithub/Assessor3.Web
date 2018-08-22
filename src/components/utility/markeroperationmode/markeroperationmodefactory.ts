import userInfoStore = require('../../../stores/userinfo/userinfostore');
import awardingOperationMode = require('./awardingoperationmode');
import teamManagementOperationMode = require('./teammanagementoperationmode');
import standardisationSetupOperationMode = require('./standardisationsetupoperationmode');
import markingOperationMode = require('./markingoperationmode');
import operationMode = require('./operationmode');
import enums = require('../enums');

/**
 * Marker operation mode factory class
 */
class MarkerOperationModeFactory {

    /**
     * This will return the corresponding marking operation mode object
     * @param markerOperationMode
     */
    public get operationMode(): operationMode {
        let currentOperationMode: enums.MarkerOperationMode = userInfoStore.instance.currentOperationMode;
        let operationMode: operationMode;
        switch (currentOperationMode) {
            case enums.MarkerOperationMode.Marking:
                operationMode = markingOperationMode;
                break;
            case enums.MarkerOperationMode.TeamManagement:
                operationMode = teamManagementOperationMode;
                break;
            case enums.MarkerOperationMode.StandardisationSetup:
                operationMode = standardisationSetupOperationMode;
                break;
            case enums.MarkerOperationMode.Awarding:
                operationMode = awardingOperationMode;
                break;
        }

        return operationMode;
    }
}

let markerOperationModeFactory = new MarkerOperationModeFactory();
export = markerOperationModeFactory;