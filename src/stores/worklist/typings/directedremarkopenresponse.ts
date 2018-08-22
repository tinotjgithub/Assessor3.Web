/**
 * Represent a directed remark open response
 */
interface DirectedRemarkOpenResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    markGroupId: number;
    seedTypeId?: number;
}