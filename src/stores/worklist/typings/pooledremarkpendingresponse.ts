/**
 * Represent a pooled remark pending response
 */
interface PooledRemarkPendingResponse extends ResponseBase {
    timeToEndOfGracePeriod: number;
    lastUpdatedDate: Date;
}