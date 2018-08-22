"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var enums = require('../../../components/utility/enums');
/**
 * React component
 * @param {Props} props
 */
/* tslint:disable:variable-name */
var OriginalMarkTotal = function (props) {
    /* tslint:enable:variable-name */
    var className = 'large-text';
    if (props.isVisible) {
        switch (props.accuracyIndicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                className = className + ' txt-accurate';
                break;
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                className = className + ' txt-inacurate';
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                className = className + ' txt-intolerence';
                break;
            default:
                className = className + ' txt-accurate';
                break;
        }
    }
    return (React.createElement("span", {className: className, id: props.id}, (props.isVisible) ? props.originalMarkTotal : '--'));
};
module.exports = OriginalMarkTotal;
//# sourceMappingURL=originalmarktotal.js.map