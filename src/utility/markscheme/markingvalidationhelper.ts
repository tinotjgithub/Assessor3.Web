interface MarkingValidationHelper {
    /** validate marks */
    validateMarks(mark: any, maximumMark: number, availableMarks: Immutable.List<AllocatedMark>): boolean;
    /** format the mark */
    formatMark(mark: string, availableMarks: Immutable.List<AllocatedMark>, stepValue?: number): AllocatedMark;
}