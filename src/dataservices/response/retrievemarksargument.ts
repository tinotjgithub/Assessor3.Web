import enums = require('../../components/utility/enums');

class RetrieveMarksArgument {
    private markGroupIds: number[];
    private isWholeResponseMarking: boolean;
    private markingMode: string;
    private examinerIdForExaminerList: number;
    private isUsedInStandardisationSetup: boolean;
    private isAwardingResponse: boolean;
    private candidateScriptId: number;
    private isEBookmarkingComponent: boolean;
    private doFetchDistributedMarkDetails: boolean;
    private isSupervisorWholeResponseView: boolean;
    private authenticatedExaminerId: number;
    private isQualityFeedback: boolean;
    private isPEOrAPE: boolean;
    private remarkRequestType: enums.RemarkRequestType;
    private isBlindPracticeMarking: boolean;
    private subExaminerId: number;
    private examinerId: number;
    private isReUsableResponseView: boolean;
    private isLiveWorklist: boolean;
    private bookmarkFetchType: enums.BookMarkFetchType;

    /**
     * Initializing new instance of retrieve marks argument.
     */
    constructor(markGroupIds: number[],
        isWholeResponseMarking: boolean,
        markingMode: string,
        examinerIdForExaminerList: number,
        isUsedInStandardisationSetup: boolean,
        isAwardingResponse: boolean,
        candidateScriptId: number,
        isEBookmarkingComponent: boolean,
        doFetchDistributedMarkDetails: boolean,
        isSupervisorWholeResponseView: boolean,
        authenticatedExaminerId: number,
        isQualityFeedback: boolean,
        isPEOrAPE: boolean,
        remarkRequestType: enums.RemarkRequestType,
        isBlindPracticeMarking: boolean,
        subExaminerId: number,
        examinerId: number,
        isReUsableResponseView: boolean,
        isLiveWorklist: boolean,
        bookMarkFetchType: enums.BookMarkFetchType) {
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
}
export = RetrieveMarksArgument;