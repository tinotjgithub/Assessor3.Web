"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var FamiliarisationAction = (function (_super) {
    __extends(FamiliarisationAction, _super);
    /**
     * Constructor
     * @param success
     */
    function FamiliarisationAction(success, isFamComponentsCreated) {
        _super.call(this, action.Source.View, actionType.CREATE_FAMILARISATION_DATA_ACTION, success);
        this._isFamComponentsCreated = isFamComponentsCreated;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isCreatedSuccessfully}/g, isFamComponentsCreated.toString());
    }
    Object.defineProperty(FamiliarisationAction.prototype, "isFamComponentsCreated", {
        /**
         * Get the status of the Familiar data create action
         */
        get: function () {
            return this._isFamComponentsCreated;
        },
        enumerable: true,
        configurable: true
    });
    return FamiliarisationAction;
}(dataRetrievalAction));
module.exports = FamiliarisationAction;
//# sourceMappingURL=familiarisationaction.js.map