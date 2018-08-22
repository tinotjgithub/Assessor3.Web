/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../../components/utility/enums');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isNonNumericMark: boolean;
    originalMarkTotal: number;
    isVisible: boolean;
    accuracyIndicatorType: enums.AccuracyIndicatorType;
}

/**
 * React component
 * @param {Props} props
 */
/* tslint:disable:variable-name */
const OriginalMarkTotal = (props: Props): JSX.Element => {
/* tslint:enable:variable-name */

    let className = 'large-text';
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

    return (
        <span className={className} id={props.id}>{(props.isVisible) ? props.originalMarkTotal : '--'}</span>
    );
};

export = OriginalMarkTotal;
