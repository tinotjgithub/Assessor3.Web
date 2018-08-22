/**
 * Submit response return type
 */
interface SubmitResponseReturn {
    /* Whether response submit is succeeded or not */
    success: boolean;

    /* The submitted responses count */
    submittedResponseCount: number;

    /* The error status code */
    responseSubmitErrorCode: number;

    /* approval status of examiner*/
    examinerApprovalStatus: number;

    /*Quality feedback status */
    hasQualityFeedbackOutstanding: boolean;

    /*Seed Submission Status */
    seedSubmissionStatus: number;

    /*Submited response Seed Type */
    seedTypeId: number;

    /*Submited response SeedType  Collection against markgroupId*/
    seedCollection: Immutable.Map<number, number>;

}