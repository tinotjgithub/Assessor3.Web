/**
 * Represent mark check examniner info
 */
interface MarkingCheckExaminerInfo {
    fromExaminerID: number;
    toExaminerID: number;
    messageTypeID: number;
    toExaminer: Examiner;
    roleID: number;
    examinerRoleID: number;
    isSelected: boolean;
    selectedTab: number;
}