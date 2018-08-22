
interface Message {
    subject: string;
    fromExaminerId: number;
    toExaminerId: Immutable.List<number>;
    priorityName: string;
    relatedResponseDisplayId: number;
    examinerMessageId: number;
    status: number;
    examinerDetails: Examiner;
    displayDate: string;
    examinerMessageBodyFirstLine: string;
    messageBody: string;
    assessmentName: string;
    maxMessageBodyFirstLineWords: number;
    markSchemeGroupId: number;
    messageFolderType: number;
    examBodyMessageTypeId: number;
    canReply: boolean;
    bodyMetadata: string;
    toTeam: boolean;
    toExaminerDetails: Immutable.List<Examiner>;
    messageDistributionIds: Immutable.List<number>;
}