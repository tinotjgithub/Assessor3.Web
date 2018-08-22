interface ExceptionActionParams {
    exception: RaiseExceptionParams;
    actionType: number;
    requestedByExaminerRoleId: number;
    qigId: number;
    worklistType?: number;
    responseMode?: number;
    remarkRequestType?: number;
    displayId?: string;
}