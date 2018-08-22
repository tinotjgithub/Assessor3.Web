import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
/**
 * Common schema for mark calculation
 * @interface
 */
interface MarkCalculationRuleSchema {
    /**
     * CalculateMaximumAndTotalMark
     */
    calculateMaximumAndTotalMark(treeItem: treeViewItem, currentBIndex?: number,
        marksManagementHelper?: MarksAndAnnotationsManagementBase, optionalItems?: Array<OptionalityDictionary>): void;
}
export = MarkCalculationRuleSchema;
