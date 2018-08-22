"use strict";
var RetrieveMarksArgument = (function () {
    /**
     * Initializing new instance of retrieve marks argument.
     */
    function RetrieveMarksArgument(markGroupIds, isWholeResponseMarking, markingMode, examinerIdForExaminerList, isUsedInStandardisationSetup, isAwardingResponse, candidateScriptId, isEBookmarkingComponent, doFetchDistributedMarkDetails, isSupervisorWholeResponseView, authenticatedExaminerId, isQualityFeedback, isPEOrAPE, remarkRequestType, isBlindPracticeMarking, subExaminerId, examinerId, isReUsableResponseView, isLiveWorklist, bookMarkFetchType) {
        this.markGroupIds = markGroupIds;
        this.isWholeResponseMarking = isWholeResponseMarking;
        this.markingMode = markingMode;
        this.examinerIdForExaminerList = examinerIdForExaminerList;
        this.isUsedInStandardisationSetup = isUsedInStandardisationSetup;
        this.isAwardingResponse = isAwardingResponse;
        this.candidateScriptId = candidateScriptId;
        this.isEBookmarkingComponent = isEBookmarkingComponent;
        this.doFetchDistributedMarkDetails = doFetchDistributedMarkDetails;
        this.isSupervisorWholeResponseView = isSupervisorWholeResponseView;
        this.authenticatedExaminerId = authenticatedExaminerId;
        this.isQualityFeedback = isQualityFeedback;
        this.isPEOrAPE = isPEOrAPE;
        this.remarkRequestType = remarkRequestType;
        this.isBlindPracticeMarking = isBlindPracticeMarking;
        this.subExaminerId = subExaminerId;
        this.examinerId = examinerId;
        this.isReUsableResponseView = isReUsableResponseView;
        this.isLiveWorklist = isLiveWorklist;
        this.bookmarkFetchType = bookMarkFetchType;
    }
    return RetrieveMarksArgument;
}());
module.exports = RetrieveMarksArgument;
//# sourceMappingURL=retrievemarksargument.js.map