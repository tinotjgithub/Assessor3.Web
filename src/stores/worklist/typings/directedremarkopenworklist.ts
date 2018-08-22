/**
 * Represent a directed remark open response
 */
interface DirectedRemarkOpenWorklist extends WorklistBase, GridDataList {
    responses: Immutable.List<DirectedRemarkOpenResponse>;
}