import enums = require('../../../components/utility/enums');

interface SaveMarksAndAnnotationsReturn {
    saveMarksErrorCode: enums.SaveMarksAndAnnotationErrorCode;
    markingStatus: string;
    displayId: number;
    updatedMarkAnnotationDetails: Immutable.Map<number, MarksAndAnnotationsToReturn>;
    updatedMarkGroupVersions: Immutable.Map<number, number>;
    lastUpdatedDate: Date;
    marksAndAnnotationsMismatch: Immutable.Map<number, MarkAnnotationMismatch>;
    markSchemesHavingAnnotationsMismatch: Immutable.List<number>;
    totalMarkMismatch: Immutable.Map<number, TotalMarkMismatch>;
    unUsedMarkschemeIds?: Immutable.List<number>;
    totalMarks?: number;
    markingProgress?: number;
    rowVersion?: string;
}

export = SaveMarksAndAnnotationsReturn;