/**
 * interface definition for awarding candidate data
 */
interface AwardingCandidateDetails {
    awardingCandidateID : number;
    centreNumber : string;
    centreCandidateNo : string;
    sampleArchiveID: number;
    grade: string;
    totalMark : number;
    awardingJudgementID : number;
    awardingJudgementStatusID? : number;
    awardingJudgementCount: number;
    markingMethodID: number;
    examSessionID: number;
    awardingJudgementStatusName: string;
    responseItemGroups: Immutable.List<ResponseItemGroup>;
}