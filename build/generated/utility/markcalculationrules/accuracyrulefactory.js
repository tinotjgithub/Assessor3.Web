"use strict";
var enums = require('../../components/utility/enums');
var markSchemeToleranceAccuracyRule = require('./markschemetoleranceaccuracyrule');
var defaultAccuracyRule = require('./defaultaccuracyrule');
var specificMarkToleranceAccuracyRule = require('./specificmarktoleranceaccuracyrule');
var AccuracyRuleFactory = (function () {
    function AccuracyRuleFactory() {
    }
    /**
     * returns the accuracy calculation rule object.
     * @param ruleType -The accuracy calculation rule type.
     */
    AccuracyRuleFactory.prototype.getAccuracyRule = function (ruleType, responseMode, markGroupId) {
        var _accuracyRule = undefined;
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
    };
    return AccuracyRuleFactory;
}());
var accuracyRuleFactory = new AccuracyRuleFactory();
module.exports = accuracyRuleFactory;
//# sourceMappingURL=accuracyrulefactory.js.map