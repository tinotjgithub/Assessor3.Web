/**
 * Represent a pooled remark open response
 */
interface PooledRemarkOpenResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    markGroupId: number;
}