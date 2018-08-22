/**
 * Represent a pending response
 */
interface DirectedRemarkPendingResponse extends ResponseBase {
    timeToEndOfGracePeriod: number;
    lastUpdatedDate: Date;
}