/**
 * Return parameter of requesting a remark
 */
interface RequestRemarkReturn {
    markGroupIds: Immutable.List<number>;
    remarkRequestCreatedCount: number;
    resultType: number;
}