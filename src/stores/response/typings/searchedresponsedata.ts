interface SearchedResponseData {
    displayId: string;
    markSchemeGroupId: number;
    examinerRoleId: number;
    approvalStatusId: number;
    markingModeId: number;
    responseMode: number;
    markGroupId: number;
    esMarkGroupId: number;
    questionPaperId: number;
    markingMethodId: number;
    remarkRequestType: number;
    messageId: number;
    hasQualityFeedbackOutstanding: boolean;
    isDirectedRemark: boolean;
    isAtypical: boolean;
    examinerId: number;
    loggedInExaminerId: number;
    loggedInExaminerRoleId: number;
    isElectronicStandardisationTeamMember: boolean;
    navigateToHelpExaminer: boolean;
    triggerPoint: number; // enums.TriggerPoint
    isTeamManagement: boolean;
    wholeresponseMarkGroupIds?: Immutable.List<number>;
    isStandardisationSetup: boolean;
    standardisationSetupWorklistType?: number;
    esDisplayId?: string;
}