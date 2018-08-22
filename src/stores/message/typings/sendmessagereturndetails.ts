interface SendMessageReturnDetails {
    success: boolean;
    isSuspended: boolean;
    failureCode: number;
    messageSendErrorCode?: number;
}