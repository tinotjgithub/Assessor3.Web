/**
 * Represent a pooled remark closed response
 */
interface PooledRemarkClosedResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    seedTypeId?: number;
    qualityFeedbackStatusId?: number;
    isWithdrawnSeed?: boolean;
    isPromotedSeed?: boolean;
    hasDefinitiveMarks?: boolean;
}