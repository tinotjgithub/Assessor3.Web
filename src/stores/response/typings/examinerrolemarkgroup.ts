interface ExaminerRoleMarkGroup {
    ExaminerRoleId: number;
    MarkGroupId: number;
    IsRetained: boolean;
    AuthenticatedExaminerRoleId: number;
    RoleId: number;
    MarkSchemeGroupId: number;
    SubmittedDate: Date;
    RemarkRequestTypeId: number;
    TotalMarks: number;
}

export = ExaminerRoleMarkGroup;