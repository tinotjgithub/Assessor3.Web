"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for removing response from collection.
 */
var UpdateStandardisationSetupResponseCollectionAction = (function (_super) {
    __extends(UpdateStandardisationSetupResponseCollectionAction, _super);
    /**
     * Constructor UpdateResponseAction
     */
    function UpdateStandardisationSetupResponseCollectionAction(esMarkGroupId, stdWorklistType) {
        _super.call(this, action.Source.View, actionType.DISCARD_STD_SETUP_RESPONSE_REMOVE_ACTION);
        this._stdWorklistType = stdWorklistType;
        this._esMarkGroupId = esMarkGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{esMarkGroupId}/g, esMarkGroupId.toString());
    }
    Object.defineProperty(UpdateStandardisationSetupResponseCollectionAction.prototype, "esMarkGroupID", {
        /**
         * return mark group id.
         */
        get: function () {
            return this._esMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateStandardisationSetupResponseCollectionAction.prototype, "standardisationdWorklistType", {
        /**
         * return worklist type.
         */
        get: function () {
            return this._stdWorklistType;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateStandardisationSetupResponseCollectionAction;
}(action));
module.exports = UpdateStandardisationSetupResponseCollectionAction;
//# sourceMappingURL=updatestandardisationsetupresponsecollectionaction.js.map