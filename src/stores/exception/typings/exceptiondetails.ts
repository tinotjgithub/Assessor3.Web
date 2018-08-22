interface ExceptionDetails {
    uniqueId: number;
    exceptionType: number;
    currentStatus: number;
    dateTimeRaised: string;
    exceptionComments: Immutable.List<ExceptionComments>;
    markSchemeID: number;
    examinerName: string;
    displayId: number;
    ownerEscalationPoint: number;
    ownerExaminerId: number;
    markGroupId: number;
    candidateScriptID: number;
    markSchemeGroupID: number;
    questionPaperPartID: number;
    originatorExaminerId: number;
    iseBookMarking: boolean;
    alternativeEscalationPoint: number;
}