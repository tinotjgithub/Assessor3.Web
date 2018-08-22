import accuracyRuleSchema = require('./accuracyruleschema');
import enums = require('../../components/utility/enums');
import markSchemeToleranceAccuracyRule = require('./markschemetoleranceaccuracyrule');
import defaultAccuracyRule = require('./defaultaccuracyrule');
import specificMarkToleranceAccuracyRule = require('./specificmarktoleranceaccuracyrule');

class AccuracyRuleFactory {
    /**
     * returns the accuracy calculation rule object.
     * @param ruleType -The accuracy calculation rule type.
     */
    public getAccuracyRule(ruleType: enums.AccuracyRuleType,
        responseMode: enums.MarkingMode, markGroupId: number): accuracyRuleSchema {

        let _accuracyRule: accuracyRuleSchema = undefined;
        switch (ruleType) {
            case enums.AccuracyRuleType.default:
                _accuracyRule = new defaultAccuracyRule(responseMode, markGroupId);
                break;
            case enums.AccuracyRuleType.markschemetolerance:
                _accuracyRule = new markSchemeToleranceAccuracyRule(responseMode, markGroupId);
                break;
            case enums.AccuracyRuleType.specificmarktolerance:
                _accuracyRule = new specificMarkToleranceAccuracyRule(responseMode, markGroupId);
                break;
        }

        /** returns the accuracy calculatin rule */
        return _accuracyRule;
    }
}

let accuracyRuleFactory = new AccuracyRuleFactory();
export = accuracyRuleFactory;