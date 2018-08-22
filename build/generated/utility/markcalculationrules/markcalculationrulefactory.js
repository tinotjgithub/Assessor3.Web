"use strict";
var enums = require('../../components/utility/enums');
var defaultMarkCalculationRule = require('./defaultmarkcalculationrule');
var MarkCalculationRuleFactory = (function () {
    function MarkCalculationRuleFactory() {
    }
    /**
     * returns the mark calculation rule object.
     * @param ruleType -The mark calculation rule type.
     */
    MarkCalculationRuleFactory.prototype.getMarkCalculationRule = function (ruleType) {
        var _markCalculationRule = undefined;
        switch (ruleType) {
            case enums.MarkRuleType.default:
                _markCalculationRule = new defaultMarkCalculationRule();
        }
        /** returns the mark calculatin rule */
        return _markCalculationRule;
    };
    return MarkCalculationRuleFactory;
}());
var validatorFactory = new MarkCalculationRuleFactory();
module.exports = validatorFactory;
//# sourceMappingURL=markcalculationrulefactory.js.map