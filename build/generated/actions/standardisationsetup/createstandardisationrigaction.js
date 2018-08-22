"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Create ES Rig action
 */
var CreateStandardisationRigAction = (function (_super) {
    __extends(CreateStandardisationRigAction, _super);
    /**
     * Constructor
     * @param success
     * @param resultData
     */
    function CreateStandardisationRigAction(success, resultData, doMarkNow) {
        _super.call(this, action.Source.View, actionType.CREATE_STANDARDISATION_RIG);
        this.createdStandardisationRIGReturnDetails = resultData;
        this.doMarkNow = doMarkNow;
    }
    Object.defineProperty(CreateStandardisationRigAction.prototype, "errorInRigCreation", {
        get: function () {
            var createRigError = this.createdStandardisationRIGReturnDetails.createStandardisationRIGReturnDetails.first().createRigError;
            return (createRigError === enums.CreateRigError.RigAllocated || createRigError === enums.CreateRigError.ScriptNotFound);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreateStandardisationRigAction.prototype, "createdStandardisationRIGDetails", {
        get: function () {
            return this.createdStandardisationRIGReturnDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreateStandardisationRigAction.prototype, "isDoMarkNow", {
        get: function () {
            return this.doMarkNow;
        },
        enumerable: true,
        configurable: true
    });
    return CreateStandardisationRigAction;
}(action));
module.exports = CreateStandardisationRigAction;
//# sourceMappingURL=createstandardisationrigaction.js.map