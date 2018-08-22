/**
 * Interface definition for script image details.
 */
interface ScriptImage {
    pageNumber: number;
    rowVersion: string;
    isSuppressed: boolean;
    isAdditionalObject: boolean;
    candidateScriptId: number;
    documentId: number;
    suppressedLimit: number;
    responseLink: string;
}

/**
 * Interface for the image details
 */
interface ImageDetails {
    pageNo: number;
    width: number;
    height: number;
}