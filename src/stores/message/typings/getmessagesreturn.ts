interface GetMessagesReturn {
    success: boolean;
    errorMessage?: string;
    messages: Immutable.List<Message>;
    messagingMarkSchemes: Immutable.List<MessagingMarkScheme>;
    totalUnreadMessageCount: number;
}