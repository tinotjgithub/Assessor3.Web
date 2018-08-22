/**
 * Represent a standardisation closed response
 */
interface StandardisationClosedResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
}