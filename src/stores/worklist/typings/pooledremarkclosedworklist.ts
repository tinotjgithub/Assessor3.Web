/**
 * Represent a pooled remark closed response
 */
interface PooledRemarkClosedWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<PooledRemarkClosedResponse>;
}