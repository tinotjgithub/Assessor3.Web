"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../../components/utility/enums');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * React component
 * @param {Props} props
 */
/* tslint:disable:variable-name */
var OriginalMarkAccuracy = function (props) {
    /* tslint:enable:variable-name */
    var className = 'small-text';
    var accuracyType = '';
    var title = '';
    if (props.isVisible) {
        switch (props.accuracyIndicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                className = className + ' txt-accurate';
                accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.accurate');
                title = markerOperationModeFactory.operationMode.accurateOriginalAccuracyIndicatorTitle;
                break;
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                className = className + ' txt-inacurate';
                accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate');
                title = markerOperationModeFactory.operationMode.inaccurateOriginalAccuracyIndicatorTitle;
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                className = className + ' txt-intolerence';
                accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance');
                title = markerOperationModeFactory.operationMode.intoleranceOriginalAccuracyIndicatorTitle;
                break;
            default:
                className = className + ' txt-accurate';
                break;
        }
    }
    return (React.createElement("span", {className: className, id: props.id, title: title}, accuracyType));
};
module.exports = OriginalMarkAccuracy;
//# sourceMappingURL=originalmarkaccuracy.js.map