/**
 * Represent a pending response
 */
interface PendingResponse extends ResponseBase {
    timeToEndOfGracePeriod: number;
    lastUpdatedDate: Date;
    isWithdrawnSeed: boolean;
    isPromotedSeed?: boolean;
    hasDefinitiveMarks?: boolean;
}