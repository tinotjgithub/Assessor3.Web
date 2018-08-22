"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Class for Configurable Characteristics Store
 */
var ConfigurableCharacteristicsStore = (function (_super) {
    __extends(ConfigurableCharacteristicsStore, _super);
    /**
     * @constructor
     */
    function ConfigurableCharacteristicsStore() {
        var _this = this;
        _super.call(this);
        this._ccLoadedForMarkSchemeGroupId = 0;
        this._operationMode = enums.MarkerOperationMode.Marking;
        this.dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === actionType.CC) {
                _this.success = action.success;
                if (_this.success) {
                    // Depending on the CC level passed-in, different objects in the store gets filled in
                    switch (action.getCCLevel) {
                        case enums.ConfigurableCharacteristicLevel.ExamBody:
                            _this.examBodyCCLoaded = true;
                            _this.examBodyCCData = action.getConfigurableCharacteristics;
                            _this.emit(ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET);
                            break;
                        case enums.ConfigurableCharacteristicLevel.MarkSchemeGroup:
                            var _configurableCharacteristicsAction = action;
                            _this.markSchemeGroupCCData = _configurableCharacteristicsAction.getConfigurableCharacteristics;
                            _this._ccLoadedForMarkSchemeGroupId = _configurableCharacteristicsAction.getCCLoadedForMarkSchemeGroupId;
                            _this.emit(ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET);
                            break;
                        default:
                            break;
                    }
                }
            }
            if (action.actionType === actionType.WORKLIST_INITIALISATION_STARTED) {
                var result = action.configurableCharacteristicData;
                if (result.configurableCharacteristics !== undefined) {
                    _this.markSchemeGroupCCData = result;
                }
            }
            // Current operation mode is stored to refer in the ConfigurableCharacteristicsHelper to avoid circular reference
            if (action.actionType === actionType.MARKER_OPERATION_MODE_CHANGED_ACTION) {
                var markerOperationMode = action;
                _this._operationMode = markerOperationMode.operationMode;
            }
        });
    }
    Object.defineProperty(ConfigurableCharacteristicsStore.prototype, "getExamBodyConfigurableCharacteristicsData", {
        /**
         * Get ExamBody Configurable Characteristics Data
         */
        get: function () {
            return this.examBodyCCData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsStore.prototype, "getMarkSchemeGroupConfigurableCharacteristicsData", {
        /**
         * Get MarkScheme Configurable Characteristics Data
         */
        get: function () {
            return this.markSchemeGroupCCData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsStore.prototype, "isExamBodyCCLoaded", {
        /**
         * Check if isExamBodyCCLoaded
         */
        get: function () {
            return this.examBodyCCLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsStore.prototype, "ccLoadedForMarkSchemeGroupId", {
        /**
         * Get the mark Scheme Group Id for the cc
         */
        get: function () {
            return this._ccLoadedForMarkSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsStore.prototype, "currentOperationMode", {
        /**
         * Returns the current operation mode.
         * we are using this in this store to refer in configurablecharacterstichelper and to avoid circular depenedency
         */
        get: function () {
            return this._operationMode;
        },
        enumerable: true,
        configurable: true
    });
    // MarkSchemeGroup set event
    ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET = 'MarkSchemGroupGet';
    ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET = 'ExamBodyCCGet';
    return ConfigurableCharacteristicsStore;
}(storeBase));
var instance = new ConfigurableCharacteristicsStore();
module.exports = { ConfigurableCharacteristicsStore: ConfigurableCharacteristicsStore, instance: instance };
//# sourceMappingURL=configurablecharacteristicsstore.js.map