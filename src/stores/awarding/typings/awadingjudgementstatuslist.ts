/**
 * interface definition for awarding judgement status list
 */
interface AwardingJudgementStatusList {
    awardingJudgementStatusList: Immutable.List<AwardingJudgementStatus>;
    success: boolean;
    errorMessage: string;
}