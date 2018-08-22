interface DoSEPApprovalManagementActionReturn {
    success: boolean;
    actionIdentifier: number;
    sepApprovalManagementActionResult: Immutable.List<DoSEPApprovalManagementActionResult>;
}