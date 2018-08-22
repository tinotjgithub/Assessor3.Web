import markCalculationRuleSchema = require('./markcalculationruleschema');
import enums = require('../../components/utility/enums');
import defaultMarkCalculationRule = require('./defaultmarkcalculationrule');
import markCalculationRuleBase = require('./markcalculationrulebase');
class MarkCalculationRuleFactory {
   /**
    * returns the mark calculation rule object.
    * @param ruleType -The mark calculation rule type.
    */
	public getMarkCalculationRule(ruleType: enums.MarkRuleType): markCalculationRuleBase {
		let _markCalculationRule: markCalculationRuleBase = undefined;
        switch (ruleType) {
            case enums.MarkRuleType.default:
                _markCalculationRule = new defaultMarkCalculationRule();
        }
        /** returns the mark calculatin rule */
        return _markCalculationRule;
    }
}

let validatorFactory = new MarkCalculationRuleFactory();
export = validatorFactory;