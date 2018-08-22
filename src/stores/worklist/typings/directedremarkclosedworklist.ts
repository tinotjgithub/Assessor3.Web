/**
 * Represent a directed remark closed response
 */
interface DirectedRemarkClosedWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<DirectedRemarkClosedResponse>;
}