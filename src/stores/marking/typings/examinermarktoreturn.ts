interface ExaminerMarkToReturn {
    markId: number;
    markSchemeId: number;
    numericMark: number;
    markStatus: string;
    rowVersion: string;
    nonnumericMark: string;
    notAttempted: boolean;
    version: number;
    uniqueId: string;
    markingOperation: number;
}