interface MessageDetails {
    examinerMessageId: number;
    body: string;
    displayId: string;
    candidateScriptId?: number;
    markGroupId?: number;
    esMarkGroupId?: number;
    hasPermissionToDisplayId?: boolean;
    markingModeId?: number;
    isElectronicStandardisationTeamMember?: number;
    isTeamManagement: boolean;
    isStandardisationSetup: boolean;
    standardisationSetupWorklistType: number;
    esDisplayId?: string;
    markSchemeGroupID?: number;
    hasPermissionInStdSetupWorklist?: boolean;
}