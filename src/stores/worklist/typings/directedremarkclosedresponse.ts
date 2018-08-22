/**
 * Represent a directed remark closed response
 */
interface DirectedRemarkClosedResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    seedTypeId?: number;
    qualityFeedbackStatusId?: number;
    isWithdrawnSeed?: boolean;
    isPromotedSeed?: boolean;
    hasDefinitiveMarks?: boolean;
}