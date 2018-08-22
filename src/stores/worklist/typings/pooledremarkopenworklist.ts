/**
 * Represent a pooled remark open response
 */
interface PooledRemarkOpenWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<PooledRemarkOpenResponse>;
}