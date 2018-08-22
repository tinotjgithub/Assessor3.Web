"use strict";
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var awardingOperationMode = require('./awardingoperationmode');
var teamManagementOperationMode = require('./teammanagementoperationmode');
var standardisationSetupOperationMode = require('./standardisationsetupoperationmode');
var markingOperationMode = require('./markingoperationmode');
var enums = require('../enums');
/**
 * Marker operation mode factory class
 */
var MarkerOperationModeFactory = (function () {
    function MarkerOperationModeFactory() {
    }
    Object.defineProperty(MarkerOperationModeFactory.prototype, "operationMode", {
        /**
         * This will return the corresponding marking operation mode object
         * @param markerOperationMode
         */
        get: function () {
            var currentOperationMode = userInfoStore.instance.currentOperationMode;
            var operationMode;
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
        },
        enumerable: true,
        configurable: true
    });
    return MarkerOperationModeFactory;
}());
var markerOperationModeFactory = new MarkerOperationModeFactory();
module.exports = markerOperationModeFactory;
//# sourceMappingURL=markeroperationmodefactory.js.map