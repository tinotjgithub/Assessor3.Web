"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to update the marking details
 */
var UpdatemarkingdetailsAction = (function (_super) {
    __extends(UpdatemarkingdetailsAction, _super);
    /**
     * Initializing a new instance.
     */
    function UpdatemarkingdetailsAction(markDetails, isAllPagesAnnotated, markGroupId) {
        _super.call(this, action.Source.View, actionType.UPDATE_MARKING_DETAILS);
        this._markDetails = markDetails;
        this._isAllPagesAnnotated = isAllPagesAnnotated;
        this._markGroupId = markGroupId;
    }
    Object.defineProperty(UpdatemarkingdetailsAction.prototype, "markDetails", {
        /**
         * returns mark details.
         */
        get: function () {
            return this._markDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatemarkingdetailsAction.prototype, "isAllPagesAnnotated", {
        /**
         * returns is All Pages Annotated flag.
         */
        get: function () {
            return this._isAllPagesAnnotated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatemarkingdetailsAction.prototype, "markGroupId", {
        /**
         * returns markGroup identifier.
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return UpdatemarkingdetailsAction;
}(action));
module.exports = UpdatemarkingdetailsAction;
//# sourceMappingURL=updatemarkingdetailsaction.js.map