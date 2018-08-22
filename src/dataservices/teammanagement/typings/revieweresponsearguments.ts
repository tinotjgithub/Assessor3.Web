/**
 * Interface used to carry the arguments for reviewing a response
 */
interface ReviewResponseArguments {
    markGroupId: number;
    isSeed: boolean;
    reviewerExaminerRoleId: number;
    selectedExaminerRoleId: number;
    subordinateExaminerId: number;
    markSchemeGroupId: number;
    reviewCommentId: number;
}