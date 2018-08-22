"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for setting fracs data for structured Images
 */
var StructuredFracsDataSetAction = (function (_super) {
    __extends(StructuredFracsDataSetAction, _super);
    /**
     * Initializing a new instance of set fracs data for structured images
     */
    function StructuredFracsDataSetAction(source) {
        _super.call(this, action.Source.View, actionType.STRUCTURED_FRACS_DATA_SET);
        this.auditLog.logContent = this.auditLog.logContent;
        this._fracsDataSource = source;
    }
    Object.defineProperty(StructuredFracsDataSetAction.prototype, "fracsDataSource", {
        /**
         * This will return the source of fracs data set action.
         */
        get: function () {
            return this._fracsDataSource;
        },
        enumerable: true,
        configurable: true
    });
    return StructuredFracsDataSetAction;
}(action));
module.exports = StructuredFracsDataSetAction;
//# sourceMappingURL=structuredfracsdatasetaction.js.map