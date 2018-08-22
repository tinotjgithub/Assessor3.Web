/**
 * Represent a standardisation open response
 */
interface StandardisationOpenResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    markGroupId: number;
}