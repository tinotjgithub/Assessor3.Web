interface MarksAndAnnotationsToReturn {
    markGroupId: number;
    examinerMarkToReturn: Immutable.List<ExaminerMarkToReturn>;
    annotationToReturn: Immutable.List<AnnotationToReturn>;
    enhancedOffPageCommentToReturn: Immutable.List<EnhancedOffPageCommentToReturn>;
    bookmarksToReturn: Immutable.List<BookmarkToReturn>;
}

