/**
 * Represent a pooled remark worklist
 */
interface PooledRemarkPendingWorkList extends WorklistBase, GridDataList {
    responses: Immutable.List<PooledRemarkPendingResponse>;
}