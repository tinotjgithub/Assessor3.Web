interface ExaminerData extends GridData {
    examinerId: number;
    examinerLevel: number;
    examinerRoleId: number;
    parentExaminerRoleId: number;
    initials: string;
    surname: string;
    subordinates: Array<ExaminerData>;
    progress: number;
    target: number;
    markingTargetName: string;
    roleName: string;
    isExpanded: boolean;
    coordinationComplete: boolean;
    examinerState: string;
    suspendedCount: number;
    markingModeId: number;
    isElectronicStandardisationTeamMember: boolean;
    lockedDate: Date;
    lockedByExaminerID: number;
    lockedByExaminerInitials: string;
    lockedByExaminerSurname: string;
    responsesToReviewCount: number;
}