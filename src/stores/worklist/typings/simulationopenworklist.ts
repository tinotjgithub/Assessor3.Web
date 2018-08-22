interface SimulationOpenWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<SimulationOpenResponse>;
    concurrentLimit: number;
    unallocatedResponsesCount: number;
}