"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var dataRetrievalAction = require('../base/dataretrievalaction');
/**
 * Action class for reordering response action.
 */
var ReOrderResponseAction = (function (_super) {
    __extends(ReOrderResponseAction, _super);
    /**
     * Constructor for ReorderErrorPopupDisplayAction
     */
    function ReOrderResponseAction(success, reorderResponseDetails) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_REORDER_RESPONSE, success);
        this._reorderResponseDetails = reorderResponseDetails;
    }
    Object.defineProperty(ReOrderResponseAction.prototype, "reorderResponseDetails", {
        /**
         * Gets re ordered response details.
         */
        get: function () {
            return this._reorderResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    return ReOrderResponseAction;
}(dataRetrievalAction));
module.exports = ReOrderResponseAction;
//# sourceMappingURL=reorderresponseaction.js.map