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
 * Action class for fetching the reclassify response action.
 */
var ReclassifyResponseAction = (function (_super) {
    __extends(ReclassifyResponseAction, _super);
    /**
     * Constructor for ReclassifyResponseAction
     */
    function ReclassifyResponseAction(success, reclassifiedResponseDetails) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_RECLASSIFY_RESPONSE, success);
        this._reclassifiedResponseDetails = reclassifiedResponseDetails;
    }
    Object.defineProperty(ReclassifyResponseAction.prototype, "reclassifiedResponseDetails", {
        /**
         * Gets re classifed response details.
         */
        get: function () {
            return this._reclassifiedResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    return ReclassifyResponseAction;
}(dataRetrievalAction));
module.exports = ReclassifyResponseAction;
//# sourceMappingURL=reclassifyresponseaction.js.map