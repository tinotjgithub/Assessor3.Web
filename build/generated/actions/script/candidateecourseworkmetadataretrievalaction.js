"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
/**
 * Action class for candidate e-course work metadata retrieval
 */
var CandidateECourseWorkMetadataRetrievalAction = (function (_super) {
    __extends(CandidateECourseWorkMetadataRetrievalAction, _super);
    /**
     * Constructor for the action class
     * @param userActionType
     * @param candidateECourseWorkMetadata
     */
    function CandidateECourseWorkMetadataRetrievalAction(userActionType, candidateECourseWorkMetadata) {
        _super.call(this, action.Source.View, userActionType, true);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, 'true');
        this.candidateECourseWorkMetadata = candidateECourseWorkMetadata;
    }
    /**
     * returns candidate e-course work metadata
     */
    CandidateECourseWorkMetadataRetrievalAction.prototype.getCandidateECourseWorkMetadata = function () {
        return this.candidateECourseWorkMetadata;
    };
    Object.defineProperty(CandidateECourseWorkMetadataRetrievalAction.prototype, "getIsSelectResponsesInStdSetup", {
        /**
         * if the user is currently in SSU select Responses tab
         */
        get: function () {
            return markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup;
        },
        enumerable: true,
        configurable: true
    });
    return CandidateECourseWorkMetadataRetrievalAction;
}(dataRetrievalAction));
module.exports = CandidateECourseWorkMetadataRetrievalAction;
//# sourceMappingURL=candidateecourseworkmetadataretrievalaction.js.map