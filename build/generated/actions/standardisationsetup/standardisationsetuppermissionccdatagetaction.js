"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for fetching Standardisation Setup permission cc data.
 */
var StandardisationSetupPermissionCCDataGetAction = (function (_super) {
    __extends(StandardisationSetupPermissionCCDataGetAction, _super);
    /**
     * Constructor for StandardisationSetupPermissionCCDataGetAction
     */
    function StandardisationSetupPermissionCCDataGetAction(examinerRole, markSchemeGroupId) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SETUP_PERMISSION_CC_DATA_GET_ACTION);
        this._examinerRole = examinerRole;
        this._markSchemeGroupId = markSchemeGroupId;
    }
    Object.defineProperty(StandardisationSetupPermissionCCDataGetAction.prototype, "examinerRole", {
        /**
         * Gets examiner role name.
         */
        get: function () {
            return this._examinerRole;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupPermissionCCDataGetAction.prototype, "markSchemeGroupId", {
        /**
         * Gets mark scheme group id.
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationSetupPermissionCCDataGetAction;
}(action));
module.exports = StandardisationSetupPermissionCCDataGetAction;
//# sourceMappingURL=standardisationsetuppermissionccdatagetaction.js.map