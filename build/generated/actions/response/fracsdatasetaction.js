"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Action class for setting fracs data.
 */
var FracsDataSetAction = (function (_super) {
    __extends(FracsDataSetAction, _super);
    /**
     * Constructor FracsDataSetAction
     * @param success
     * @param fracsData
     */
    function FracsDataSetAction(success, fracsData, triggerScrollEvent, structuredFracsDataLoaded, fracsDataSource) {
        if (triggerScrollEvent === void 0) { triggerScrollEvent = false; }
        if (structuredFracsDataLoaded === void 0) { structuredFracsDataLoaded = false; }
        _super.call(this, action.Source.View, actionType.FRACS_DATA_SET, success);
        this._triggerScrollEvent = false;
        this._structuredFracsDataLoaded = false;
        this._fracsDataSource = enums.FracsDataSetActionSource.None;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._fracsData = fracsData;
        this._triggerScrollEvent = triggerScrollEvent;
        this._structuredFracsDataLoaded = structuredFracsDataLoaded;
        this._fracsDataSource = fracsDataSource;
    }
    Object.defineProperty(FracsDataSetAction.prototype, "fracsData", {
        /**
         * This will return the fracs data.
         */
        get: function () {
            return this._fracsData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FracsDataSetAction.prototype, "triggerScrollEvent", {
        get: function () {
            return this._triggerScrollEvent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FracsDataSetAction.prototype, "structuredFracsDataLoaded", {
        get: function () {
            return this._structuredFracsDataLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FracsDataSetAction.prototype, "fracsDataSource", {
        /**
         * This will return the source of fracs data set action
         */
        get: function () {
            return this._fracsDataSource;
        },
        enumerable: true,
        configurable: true
    });
    return FracsDataSetAction;
}(dataRetrievalAction));
module.exports = FracsDataSetAction;
//# sourceMappingURL=fracsdatasetaction.js.map