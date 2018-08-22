"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for fetching the declassify popup display action.
 */
var DeclassifyPopupDisplayAction = (function (_super) {
    __extends(DeclassifyPopupDisplayAction, _super);
    /**
     * Constructor for DeclassifyPopupDisplayAction
     */
    function DeclassifyPopupDisplayAction(displayId, totalMarkValue, candidateScriptId, esCandidateScriptMarkSchemeGroupId, markingModeId, rigOrder) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_DECLASSIFY_POPUP);
        this._displayId = displayId;
        this._totalMarkValue = totalMarkValue;
        this._candidateScriptId = candidateScriptId;
        this._esCandidateScriptMarkSchemeGroupId = esCandidateScriptMarkSchemeGroupId;
        this._markingModeId = markingModeId;
        this._rigOrder = rigOrder;
    }
    Object.defineProperty(DeclassifyPopupDisplayAction.prototype, "displayId", {
        /**
         * Gets display id
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyPopupDisplayAction.prototype, "totalMarkValue", {
        /**
         * Gets total marlk value
         */
        get: function () {
            return this._totalMarkValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyPopupDisplayAction.prototype, "candidateScriptId", {
        /**
         * Gets candidate script id value
         */
        get: function () {
            return this._candidateScriptId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyPopupDisplayAction.prototype, "esCandidateScriptMarkSchemeGroupId", {
        /**
         * Gets es candidate script mark scheme group id value
         */
        get: function () {
            return this._esCandidateScriptMarkSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyPopupDisplayAction.prototype, "markingModeId", {
        /**
         * Gets marking mode id value
         */
        get: function () {
            return this._markingModeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclassifyPopupDisplayAction.prototype, "rigOrder", {
        /**
         * Gets rig order value
         */
        get: function () {
            return this._rigOrder;
        },
        enumerable: true,
        configurable: true
    });
    return DeclassifyPopupDisplayAction;
}(action));
module.exports = DeclassifyPopupDisplayAction;
//# sourceMappingURL=declassifypopupdisplayaction.js.map