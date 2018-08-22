class MarkingInstrcutionArgument {
    private documentId: number;
    private questionPaperId: number;
    private markSchemeGroupId: number;
    private markingInstructionLevel: number;
    private markingInstructionId: number;
    private isAlreadyRead: boolean;

    /**
     * Initializing new instance of allocation.
     */
    constructor(documentId: number,
        questionPaperId: number,
        markSchemeGroupId: number,
        markingInstructionLevel: number,
        markingInstructionId: number,
        isAlreadyRead: boolean) {
        this.documentId = documentId;
        this.questionPaperId = questionPaperId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.markingInstructionLevel = markingInstructionLevel;
        this.markingInstructionId = markingInstructionId;
        this.isAlreadyRead = isAlreadyRead;
    }
}
export = MarkingInstrcutionArgument;