/**
 * Common interface to alter marks for annotations and mark entry from markschemepanel collection
 * @interface
 */
interface MarksAndAnnotationsManagementBase {
    /** Add/update/delete marks from the marks collection  */
    processMark(mark: AllocatedMark, markSchemeId: number,
        markingProgress: number,
        totalMarkedMarkSchemes: number,
        totalMark: number,
        isAllNR: boolean,
        isMarkUpdatedWithoutNavigation: boolean,
        isNextResponse: boolean,
        usedInTotal: boolean,
        isAllPagesAnnotated: boolean,
        markSchemeGroupId: number,
        isUpdateUsedInTotalOnly: boolean,
        isUpdateMarkingProgress: boolean,
		overallMarkingProgress: number,
		markSchemeCount: number,
		callBack?: Function
    ): void;
}
