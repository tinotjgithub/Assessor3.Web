interface PreviousMark {
    mark: AllocatedMark;
    usedInTotal: boolean;
    isDefinitive?: boolean;
    isOriginalMark?: boolean;
    upperTolerance?: number;
    lowerTolerance?: number;
}