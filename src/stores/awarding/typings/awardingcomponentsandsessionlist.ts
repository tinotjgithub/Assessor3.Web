/**
 * interface for  awarding component and session list
 */
interface AwardingComponentsAndSessionList {
    awardingComponentAndSessionList: Immutable.List<AwardingComponentAndSession>;
    success: boolean;
    errorMessage: string;
}