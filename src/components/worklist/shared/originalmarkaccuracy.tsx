/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../../components/utility/enums');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isVisible: boolean;
    accuracyIndicatorType: enums.AccuracyIndicatorType;
}

/**
 * React component
 * @param {Props} props
 */
 /* tslint:disable:variable-name */
const OriginalMarkAccuracy = (props: Props): JSX.Element => {
/* tslint:enable:variable-name */

    let className = 'small-text';
    let accuracyType = '';
    let title = '';

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

    return (
        <span className={className} id={props.id} title={title}>{accuracyType}</span>
    );
};

export = OriginalMarkAccuracy;
