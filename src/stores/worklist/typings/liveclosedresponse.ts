/**
 * Represent a live closed response
 */
interface LiveClosedResponse extends ResponseBase {
    submittedDate?: Date;
    seedTypeId?: number;
    qualityFeedbackStatusId?: number;
    isWithdrawnSeed?: boolean;
    isPromotedSeed?: boolean;
    hasDefinitiveMarks?: boolean;
    isCurrentMarkGroupPromotedAsSeed?: boolean;
}