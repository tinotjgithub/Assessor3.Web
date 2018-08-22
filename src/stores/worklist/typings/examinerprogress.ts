interface ExaminerProgress {
    openResponsesCount: number;
    closedResponsesCount: number;
    pendingResponsesCount: number;
    atypicalOpenResponsesCount?: number;
    atypicalPendingResponsesCount?: number;
    atypicalClosedResponsesCount?: number;
    conditionalApprovalConcurrentLimit: number;
    isDirectedRemark?: boolean;
}
export = ExaminerProgress;