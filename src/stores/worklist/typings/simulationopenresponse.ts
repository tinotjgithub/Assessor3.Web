/**
 * Represent a simulation open response
 */
interface SimulationOpenResponse extends ResponseBase {
    markingProgress: number;
    allocatedDate?: Date;
    updatedDate?: Date;
    markGroupId: number;
}