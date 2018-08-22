"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to save mark.
 */
var SaveMarkAction = (function (_super) {
    __extends(SaveMarkAction, _super);
    /**
     * Initializing a new instance of save mark action.
     * @param saveMarkDetails
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse - - flag is to indicate next response should be opened after save
     * @param isUpdateUsedInTotalOnly - flag to indicate whether it is a usedintotal update only.
     */
    function SaveMarkAction(saveMarkDetails, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress) {
        _super.call(this, action.Source.View, actionType.SAVE_MARK);
        this.markDetails = saveMarkDetails;
        this._isMarkUpdatedWithoutNavigation = isMarkUpdatedWithoutNavigation;
        this._isNextResponse = isNextResponse;
        this._isUpdateUsedInTotalOnly = isUpdateUsedInTotalOnly;
        this._isUpdateMarkingProgress = isUpdateMarkingProgress;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{mark}/g, saveMarkDetails.mark.displayMark).
            replace(/{markSchemeId}/g, saveMarkDetails.markSchemeId.toString()).
            replace(/{markingOperation}/g, saveMarkDetails.markingOperation.toString()).
            replace(/{isDirty}/g, saveMarkDetails.isDirty.toString()).
            replace(/{candidateScriptId}/g, saveMarkDetails.candidateScriptId.toString()).
            replace(/{markingProgress}/g, saveMarkDetails.markingProgress.toString()).
            replace(/{totalMark}/g, saveMarkDetails.totalMark.toString()).
            replace(/{totalMarkedMarkSchemes}/g, saveMarkDetails.totalMarkedMarkSchemes.toString()).
            replace(/{isAllNR}/g, saveMarkDetails.isAllNR.toString());
    }
    Object.defineProperty(SaveMarkAction.prototype, "saveMarkDetails", {
        /**
         * Get the save mark details
         */
        get: function () {
            return this.markDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarkAction.prototype, "isMarkUpdatedWithoutNavigation", {
        /**
         * Get if mark updated without navigation
         */
        get: function () {
            return this._isMarkUpdatedWithoutNavigation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarkAction.prototype, "isNextResponse", {
        /**
         * Get to indicate next response need to be opened after save
         */
        get: function () {
            return this._isNextResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarkAction.prototype, "isUpdateUsedInTotalOnly", {
        /**
         * Gets the flag to indicate whether it is a usedintotal update only.
         */
        get: function () {
            return this._isUpdateUsedInTotalOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarkAction.prototype, "isUpdateMarkingProgress", {
        /**
         * Gets the flag to indicate whether to update marking progress.
         */
        get: function () {
            return this._isUpdateMarkingProgress;
        },
        enumerable: true,
        configurable: true
    });
    return SaveMarkAction;
}(action));
module.exports = SaveMarkAction;
//# sourceMappingURL=savemarkaction.js.map