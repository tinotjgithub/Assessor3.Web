/**
 * Represent pending worklist
 */
interface PendingWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<PendingResponse>;
}