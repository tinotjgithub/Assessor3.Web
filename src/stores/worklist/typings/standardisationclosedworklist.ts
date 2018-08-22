/**
 * Represent a Standardisation Closed Response
 */
interface StandardisationClosedWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<StandardisationClosedResponse>;
}