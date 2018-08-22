"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for declassify the response.
 */
var DeclassifyResponseAction = (function (_super) {
    __extends(DeclassifyResponseAction, _super);
    /**
     * Constructor for DeclassifyResponseAction
     * @param success
     */
    function DeclassifyResponseAction(success, candidateScriptId, markingModeId, rigOrder) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_DECLASSIFY_RESPONSE);
        this._isDeclassifiedResponse = success;
        this._candidateScriptId = candidateScriptId;
        this._markingModeId = markingModeId;
        this._rigOrder = rigOrder;
    }
    Object.defineProperty(DeclassifyResponseAction.prototype, "isDeclassifiedResponse", {
        /**
         * Gets whether the response is declassified or not.
         */
        get: function () {
            return this._isDeclassifiedResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyResponseAction.prototype, "candidateScriptId", {
        /**
         * Gets candidate script id value
         */
        get: function () {
            return this._candidateScriptId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyResponseAction.prototype, "markingModeId", {
        /**
         * Gets marking mode id value
         */
        get: function () {
            return this._markingModeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyResponseAction.prototype, "rigOrder", {
        /**
         * Gets rig order value
         */
        get: function () {
            return this._rigOrder;
        },
        enumerable: true,
        configurable: true
    });
    return DeclassifyResponseAction;
}(action));
module.exports = DeclassifyResponseAction;
//# sourceMappingURL=declassifyresponseaction.js.map