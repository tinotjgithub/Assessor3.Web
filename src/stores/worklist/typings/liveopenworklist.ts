interface LiveOpenWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<LiveOpenResponse>;
    concurrentLimit: number;
    unallocatedResponsesCount: number;
}
