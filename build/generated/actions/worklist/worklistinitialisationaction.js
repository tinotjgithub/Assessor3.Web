"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var WorklistInitialisationAction = (function (_super) {
    __extends(WorklistInitialisationAction, _super);
    /**
     * @Constructor
     * @param markSchemeStructureData
     * @param ccData
     * @param markingProgressData
     */
    function WorklistInitialisationAction(markSchemeStructureData, ccData, markerInformationData, markingProgressData) {
        _super.call(this, action.Source.View, actionType.WORKLIST_INITIALISATION_STARTED);
        this._markSchemeStructureData = markSchemeStructureData;
        this._configurableCharacteristicData = ccData;
        this._markerProgressData = markingProgressData;
        this._markerinformationData = markerInformationData;
    }
    Object.defineProperty(WorklistInitialisationAction.prototype, "markSchemeStuctureData", {
        get: function () {
            return this._markSchemeStructureData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistInitialisationAction.prototype, "configurableCharacteristicData", {
        get: function () {
            return this._configurableCharacteristicData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistInitialisationAction.prototype, "markerProgressData", {
        get: function () {
            return this._markerProgressData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistInitialisationAction.prototype, "markerInformationData", {
        get: function () {
            return this._markerinformationData;
        },
        enumerable: true,
        configurable: true
    });
    return WorklistInitialisationAction;
}(action));
module.exports = WorklistInitialisationAction;
//# sourceMappingURL=worklistinitialisationaction.js.map