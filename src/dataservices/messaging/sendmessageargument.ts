class SendMessageArgument {
    private examinerList: Array<number>;
    private body: string;
    private questionPaperId: number;
    private markGroupId: number;
    private candidateScriptId: number;
    private subject: string;
    private displayId: number;
    private markSchemeGroupId: number;
    private examBodyMessageTypeID: number;
    private examinerMessageStatusID: number;
    private followUpDate: Date;
    private examinerMessageDistributionID: number;
    private examinerMessagePriorityID: number;
    private esMarkGroupId: number;
    private toTeam: boolean;
    private isTeamManagement: boolean;

    /**
     * Initializing new instance of allocation.
     */
    constructor(examinerList: Array<number>,
                body: string,
                subject: string,
                questionPaperId: number,
                displayId: number,
                priorityId: number,
                markSchemeGroupId: number,
                candidateScriptId: number,
                markGroupId: number,
                toTeam: boolean,
                esMarkGroupId: number,
                isTeamManagement: boolean,
                examBodyMessageType?: number) {
        this.examinerList = examinerList;
        this.body = body;
        this.subject = subject;
        this.questionPaperId = questionPaperId;
        this.displayId = displayId;
        this.examinerMessagePriorityID = priorityId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.candidateScriptId = candidateScriptId;
        this.markGroupId = markGroupId;
        this.toTeam = toTeam;
        this.esMarkGroupId = esMarkGroupId;
        this.isTeamManagement = isTeamManagement;
        this.examBodyMessageTypeID = examBodyMessageType;
    }
}
export = SendMessageArgument;