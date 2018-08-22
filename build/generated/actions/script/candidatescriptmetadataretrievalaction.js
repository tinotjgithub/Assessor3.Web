"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
/**
 * Action class for candidate script metadata retrieval
 */
var CandidateScriptMetadataRetrievalAction = (function (_super) {
    __extends(CandidateScriptMetadataRetrievalAction, _super);
    /**
     * Constructor for the action class
     * @param userActionType
     * @param markSchemeGroupId
     * @param questionPaperId
     * @param candidateResponseMetadata
     */
    function CandidateScriptMetadataRetrievalAction(userActionType, markSchemeGroupId, questionPaperId, candidateResponseMetadata, isAutoRefreshCall, selectedStandardisationSetupWorklist) {
        _super.call(this, action.Source.View, userActionType, true);
        this.markSchemeGroupId = markSchemeGroupId;
        this.questionPaperId = questionPaperId;
        this.candidateResponseMetadata = candidateResponseMetadata;
        this._isAutoRefreshCall = isAutoRefreshCall;
        this._selectedStandardisationSetupWorklist = selectedStandardisationSetupWorklist;
    }
    /**
     * Returns the Mark Scheme Group ID
     */
    CandidateScriptMetadataRetrievalAction.prototype.getMarkSchemeGroupId = function () {
        return this.markSchemeGroupId;
    };
    /**
     * Returns the Question Paper ID
     */
    CandidateScriptMetadataRetrievalAction.prototype.getQuestionPaperId = function () {
        return this.questionPaperId;
    };
    /**
     * Returns the Candidate Response Metadata
     */
    CandidateScriptMetadataRetrievalAction.prototype.getCandidateResponseMetadata = function () {
        return this.candidateResponseMetadata;
    };
    Object.defineProperty(CandidateScriptMetadataRetrievalAction.prototype, "isAutoRefreshCall", {
        /**
         * This will returns true for a auto refresh call
         */
        get: function () {
            return this._isAutoRefreshCall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandidateScriptMetadataRetrievalAction.prototype, "selectedStandardisationSetupWorklist", {
        get: function () {
            return this._selectedStandardisationSetupWorklist;
        },
        enumerable: true,
        configurable: true
    });
    return CandidateScriptMetadataRetrievalAction;
}(dataRetrievalAction));
module.exports = CandidateScriptMetadataRetrievalAction;
//# sourceMappingURL=candidatescriptmetadataretrievalaction.js.map