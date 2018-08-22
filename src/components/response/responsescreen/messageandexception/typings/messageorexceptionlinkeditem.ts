interface MessageOrExceptionLinkedItem {
    itemId: number;

    // Message sender Name Or Items linked in Exception
    senderOrItem: string;

    // Time displaying for Message or Exception
    timeToDisplay: string;

    // subject in Message Or Type in Exception
    subjectOrType: number|string;

    // Priority in Message or Status in Exception
    priorityOrStatus?: number | string;

    // Read status of message or Exception
    isUnreadOrUnactioned: boolean;
}