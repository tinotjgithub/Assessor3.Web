interface MarkingTarget {
    markingMode: number;
    markingCompletionDate: Date;
    maximumMarkingLimit: number;
    remarkRequestType: number;
    closedResponsesCount: number;
    pendingResponsesCount: number;
    openResponsesCount: number;
    targetComplete: boolean;
    areResponsesAvailableToBeDownloaded: boolean;
    isActive: boolean;
    markingProgress: number;
    isDirectedRemark: boolean;
    overAllocationCount: number;
    closedAtypicalResponsesCount: number;
    pendingAtypicalResponsesCount: number;
    openAtypicalResponsesCount: number;
}

export = MarkingTarget;