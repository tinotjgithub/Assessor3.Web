/**
 * interface definition for awarding candidate list
 */
interface AwardingCandidateDetailsList {
    awardingCandidateList: Immutable.List<AwardingCandidateDetails>;
    success: boolean;
    errorMessage: string;
}