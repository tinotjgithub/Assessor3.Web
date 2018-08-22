/**
 * Represent mark check examniners info
 */
interface MarkingCheckExaminersList {
    markCheckRequestedExaminersDetails: Array<MarkingCheckExaminerInfo>;
    success: boolean;
    errorMessage: string;
}
