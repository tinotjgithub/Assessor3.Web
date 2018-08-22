import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import enums = require('../../components/utility/enums');

/**
 * Common schema for Accuracy rule
 * @interface
 */
interface AccuracyRuleSchema {

    /**
     * calculate accuracy of mark schemes
     */
    calculateMarkAccuracy(examinerMark: treeViewItem, comparingMark: PreviousMark): enums.AccuracyIndicatorType;

    /**
     * calculate accuracy of response
     */
    CalculateRigTotalAndAccuracy(workItem: treeViewItem, comparingMark: AccuracyCalcCharacteristics): enums.AccuracyIndicatorType;
}
export = AccuracyRuleSchema;
