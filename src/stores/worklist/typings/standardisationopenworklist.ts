/**
 * Represent a Standardisation Open Response
 */
interface StandardisationOpenWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<StandardisationOpenResponse>;
}