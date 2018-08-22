import examinerProgress= require('./ExaminerProgress');

interface MarkingTargetSummary {
    examinerRoleID: number;
    markingModeID: number;
    remarkRequestTypeID: number;
    markingTargetDate: Date;
    maximumMarkingLimit: number;
    examinerProgress: examinerProgress;
    isTargetCompleted: boolean;
    targetCompletedDate: Date;
    maximumConcurrentLimit: number;
    isCurrentTarget: boolean;
    overAllocationCount: number;
    reviewedResponsesCount: number;
    closedResponsesCount: number;
    aggregatedMaximumMarkingLimit: number;
    aggregatedOpenResponsesCount: number;
    aggregatedClosedResponsesCount: number;
    aggregatedOverAllocationCount: number;
    aggregatedMaximumConcurrentLimit: number;
}

export = MarkingTargetSummary;