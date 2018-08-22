interface ExaminerViewDataItem extends GridData {
    examinerId: number;
    examinerLevel: number;
    examinerRoleId: number;
    parentExaminerRoleId: number;
    examinerName: string;
    isExpanded: boolean;
    hasSubordinates: boolean;
    examinerProgress: number;
    examinerTarget: number;
    markingTargetName: string;
    roleName: string;
    coordinationComplete: boolean;
    examinerState: string;
    suspendedCount: number;
    markingModeId: number;
    isElectronicStandardisationTeamMember: boolean;
    lockedDuration: string;
    lockedByExaminerID: number;
    lockedByExaminerName: string;
    responsesToReviewCount: number;
}