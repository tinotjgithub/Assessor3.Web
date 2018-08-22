"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Standardisation Setup Left Main Link Selection
 */
var StandardisationSetupTabSelectAction = (function (_super) {
    __extends(StandardisationSetupTabSelectAction, _super);
    /**
     * constructor
     * @selectedTab The type of Standardisation setup Tab
     */
    function StandardisationSetupTabSelectAction(selectedTab, markSchemeGroupId, examinerRoleId, useCache) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SETUP_LEFT_TAB_SELECT_ACTION);
        this._selectedTab = selectedTab;
        this._markSchemeGroupId = markSchemeGroupId;
        this._examinerRoleId = examinerRoleId;
        this._useCache = useCache;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedTab}/g, selectedTab.toString());
    }
    Object.defineProperty(StandardisationSetupTabSelectAction.prototype, "selectedTab", {
        /**
         * Get the Standardisation setup Link Type
         */
        get: function () {
            return this._selectedTab;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupTabSelectAction.prototype, "markSchemeGroupId", {
        /**
         * Get the markSchemeGroupId
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupTabSelectAction.prototype, "examinerRoleId", {
        /**
         * Get the examinerRoleId
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupTabSelectAction.prototype, "useCache", {
        /**
         * set cache true or false
         */
        get: function () {
            return this._useCache;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationSetupTabSelectAction;
}(action));
module.exports = StandardisationSetupTabSelectAction;
//# sourceMappingURL=standardisationsetuptabselectaction.js.map