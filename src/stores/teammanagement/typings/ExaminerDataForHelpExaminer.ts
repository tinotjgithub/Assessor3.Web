interface ExaminerDataForHelpExaminer {
    actions: number[];
    examinerId: number;
    examinerPriority: number;
    examinerRoleId: number;
    initials: string;
    surname: string;
    locked: boolean;
    lockedByExaminerId: number;
    lockedByInitials: string;
    lockedBySurname: string;
    lockTimeStamp: Date;
    workflowStateId: number;
    workflowStateTimeStamp: Date;
    parentExaminerId: number;
    parentInitials: string;
    parentSurname: string;
    roleId: number;
    autoSuspensionCount: number;
    activeQigCount: number;
    actionRequireQigCount: number;
}