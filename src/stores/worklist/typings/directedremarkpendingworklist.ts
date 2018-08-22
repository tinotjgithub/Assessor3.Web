/**
 * Represent pending worklist
 */
interface DirectedRemarkPendingWorkList extends WorklistBase, GridDataList {
    responses: Immutable.List<DirectedRemarkPendingResponse>;
}