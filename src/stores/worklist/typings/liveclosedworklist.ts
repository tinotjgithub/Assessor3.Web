/**
 * Represent a live closed worklist
 */
interface LiveClosedWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<LiveClosedResponse>;
}
