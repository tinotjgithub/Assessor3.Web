/*
 * ClassifiedResponseHeaderDetail type
 */
interface ClassifiedResponseHeaderDetail {
    markingModeId: number;
    rigOrder?: number;
    currentPosition: number;
    classifiedWorklistCountByMarkingMode: number;
}

export = ClassifiedResponseHeaderDetail;