interface MessageGroupData {
    qigId: number;
    isOpen: boolean;
    textToDisplay: string;
    messages: Message[];
    unReadMessages: number;
}