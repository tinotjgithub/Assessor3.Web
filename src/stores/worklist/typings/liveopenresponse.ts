/**
 * Represent a live open response
 */
interface LiveOpenResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    markGroupId: number;
    seedTypeId?: number;
}