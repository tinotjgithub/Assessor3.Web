interface WorklistBase extends GridDataList {
    responses: Immutable.List<ResponseBase>;
    maximumMark: number;
    hasNumericMark: boolean;
    hasSeedTargets: boolean;
}
