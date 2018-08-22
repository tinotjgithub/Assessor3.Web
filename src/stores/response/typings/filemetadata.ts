/** FileMetaData interface */

interface FileMetadata {
    url: string;
    name: string;
    pageNumber: number;
    linkType: string;
    isSuppressed: boolean;
    pageId: number;
    isConvertible: boolean;
    isImage: boolean;
}