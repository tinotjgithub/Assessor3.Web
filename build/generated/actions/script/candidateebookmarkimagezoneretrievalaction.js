"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
/**
 * Action class for candidate ebookmark image zone collection retrieval
 */
var CandidateEBookMarkImageZoneRetrievalAction = (function (_super) {
    __extends(CandidateEBookMarkImageZoneRetrievalAction, _super);
    /**
     * Constructor for the action class
     * @param userActionType
     * @param candidateEBookMarkImageZoneCollection
     */
    function CandidateEBookMarkImageZoneRetrievalAction(userActionType, candidateScriptEBookMarkImageZoneCollection) {
        _super.call(this, action.Source.View, userActionType, true);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, 'true');
        this.candidateScriptEBookMarkImageZoneCollection = candidateScriptEBookMarkImageZoneCollection;
    }
    Object.defineProperty(CandidateEBookMarkImageZoneRetrievalAction.prototype, "getCandidateScriptEBookMarkImageZoneCollection", {
        /**
         * returns candidate ebookmark image zone collection
         */
        get: function () {
            return this.candidateScriptEBookMarkImageZoneCollection;
        },
        enumerable: true,
        configurable: true
    });
    return CandidateEBookMarkImageZoneRetrievalAction;
}(dataRetrievalAction));
module.exports = CandidateEBookMarkImageZoneRetrievalAction;
//# sourceMappingURL=candidateebookmarkimagezoneretrievalaction.js.map