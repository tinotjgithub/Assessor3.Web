"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetReuseRigDetailsAction = (function (_super) {
    __extends(GetReuseRigDetailsAction, _super);
    /**
     * Constructor
     * @param success
     * @param json
     */
    function GetReuseRigDetailsAction(success, json) {
        _super.call(this, action.Source.View, actionType.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._standardisationSetupReusableDetailsList = json;
    }
    Object.defineProperty(GetReuseRigDetailsAction.prototype, "StandardisationSetupReusableDetailsList", {
        /**
         * returns the Re-Use Rig Details
         */
        get: function () {
            return this._standardisationSetupReusableDetailsList;
        },
        enumerable: true,
        configurable: true
    });
    return GetReuseRigDetailsAction;
}(dataRetrievalAction));
module.exports = GetReuseRigDetailsAction;
//# sourceMappingURL=getreuserigdetailsaction.js.map