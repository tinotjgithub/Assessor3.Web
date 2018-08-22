interface ExaminerInfo {
    examinerId: number;
    examinerRoleId: number;
    ESReviewerExaminerRoleID: number;
    surname: string;
    initials: string;
    fullName: string;
    parent: ExaminerInfo;
    stmParent: ExaminerInfo;
    subordinates: Array<ExaminerInfo>;
    success: boolean;
    errorMessage?: string;
    isOpen: boolean;
    isCurrentExaminer: boolean;
    isChecked: boolean;
    toTeam: boolean;
}