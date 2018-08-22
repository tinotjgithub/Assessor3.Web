/**
 * The request class for Image download
 */
class ScriptImageDownloadRequest {

    // Holds the candidate script ID
    public candidateScriptId: number;

    // Holds the Document ID
    public documentId: number;

    // Holds the page number
    public pageNumber: number;

    // Holds the row version
    public rowVersion: string;

    /**
     * Constructor for the ScriptImageDownloadRequest
     * @param candidateScriptId
     * @param documentId
     * @param pageNumber
     * @param rowVersion
     */
    constructor(candidateScriptId: number, documentId: number, pageNumber: number, rowVersion: string) {
        this.candidateScriptId = candidateScriptId;
        this.documentId = documentId;
        this.pageNumber = pageNumber;
        this.rowVersion = rowVersion;
    }
}

export = ScriptImageDownloadRequest;