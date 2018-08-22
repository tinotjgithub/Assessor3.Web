interface BookmarkToReturn {
    bookmarkId: number;
    examinerRoleId: number;
    markSchemeGroupId: number;
    markGroupId: number;
    pageNo: number;
    left: number;
    top: number;
    width: number;
    height: number;
    comment?: string;
    fileName?: string;
    inputFileDocumentId: number;
    rowVersion?: any;
    clientToken: string;
    isDirty: boolean;
    definitiveBookmark: boolean;
    createdDate: Date;
    markingOperation: number;
}
