"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var ConfigurableCharacteristicsAction = (function (_super) {
    __extends(ConfigurableCharacteristicsAction, _super);
    /**
     * Constructor
     * @param success
     * @param ccLevel
     * @param configurableCharacteristics
     * @param isFromHistory
     */
    function ConfigurableCharacteristicsAction(success, ccLevel, markSchemeGroupId, configurableCharacteristics) {
        _super.call(this, action.Source.View, actionType.CC, success);
        this.ccLoadedForMarkSchemeGroupId = 0;
        this._isFromHistory = false;
        this.configurableCharacteristics = configurableCharacteristics;
        this.ccLevel = ccLevel;
        this.ccLoadedForMarkSchemeGroupId = markSchemeGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(ConfigurableCharacteristicsAction.prototype, "getConfigurableCharacteristics", {
        /**
         * returns the Configurable Characteristics Data
         */
        get: function () {
            return this.configurableCharacteristics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsAction.prototype, "getCCLevel", {
        /**
         * returns the Configurable Characteristic Level
         */
        get: function () {
            return this.ccLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsAction.prototype, "getCCLoadedForMarkSchemeGroupId", {
        /**
         * Get the mark Scheme Group Id for the cc
         */
        get: function () {
            return this.ccLoadedForMarkSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return ConfigurableCharacteristicsAction;
}(dataRetrievalAction));
module.exports = ConfigurableCharacteristicsAction;
//# sourceMappingURL=configurablecharacteristicsaction.js.map