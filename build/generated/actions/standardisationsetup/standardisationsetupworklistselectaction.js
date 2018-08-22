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
var StandardisationSetupWorkListSelectAction = (function (_super) {
    __extends(StandardisationSetupWorkListSelectAction, _super);
    /**
     * constructor
     * @selectedTab The type of Standardisation setup Tab
     */
    function StandardisationSetupWorkListSelectAction(selectedWorkList, markSchemeGroupId, examinerRoleId, useCache) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SETUP_LEFT_PANEL_WORKLIST_SELECT_ACTION);
        this._selectedWorkList = selectedWorkList;
        this._markSchemeGroupId = markSchemeGroupId;
        this._examinerRoleId = examinerRoleId;
        this._useCache = useCache;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedTab}/g, selectedWorkList.toString());
    }
    Object.defineProperty(StandardisationSetupWorkListSelectAction.prototype, "selectedWorkList", {
        /**
         * Get the Standardisation setup Link Type
         */
        get: function () {
            return this._selectedWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupWorkListSelectAction.prototype, "markSchemeGroupId", {
        /**
         * Get the markSchemeGroupId
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupWorkListSelectAction.prototype, "examinerRoleId", {
        /**
         * Get the examinerRoleId
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupWorkListSelectAction.prototype, "useCache", {
        /**
         * set cache true or false
         */
        get: function () {
            return this._useCache;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationSetupWorkListSelectAction;
}(action));
module.exports = StandardisationSetupWorkListSelectAction;
//# sourceMappingURL=standardisationsetupworklistselectaction.js.map