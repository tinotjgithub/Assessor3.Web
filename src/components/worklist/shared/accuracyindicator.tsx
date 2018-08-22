/* tslint:disable:no-unused-variable */
import React = require('react');
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');

/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    accuracyIndicator?: number;
    isTileView?: boolean;
    isInMarkSchemePanel?: boolean;
}

class AccuracyIndicator extends PureRenderComponent<Props, any> {
    private accuracyType: string;
    private title: string;

    /**
     * Constructor for Accuracy indicator
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        this.getAccuracy(this.props.accuracyIndicator);
        let accuracy: JSX.Element = this.props.isTileView ?
            (<div className='tolerance-level small-text' id={this.props.id + '_accuracyIndicator'}>{this.accuracyType}</div>) :
            (this.props.isInMarkSchemePanel ?
                (<div title={this.title} className='tolerance-level small-text'>{this.accuracyType}</div>) : (
                <div className='col wl-tolerance' title={this.title} >
                <div className='col-inner'>
                        <div id={this.props.id + '_accuracyIndicator'} className='tolerance-level small-text'>{this.accuracyType}</div>
                </div>
                </div>));
        return (accuracy);
    }

    /**
     * Get the Accuracy indicator type
     * @param AccuracyIndicatorType
     */
    private getAccuracy(indicatorType: enums.AccuracyIndicatorType): any {
        switch (indicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                this.accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.accurate');
                this.title = markerOperationModeFactory.operationMode.accurateAccuracyIndicatorTitle;
                break;
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                this.accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate');
                this.title = markerOperationModeFactory.operationMode.inaccurateAccuracyIndicatorTitle;
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                this.accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance');
                this.title = markerOperationModeFactory.operationMode.intoleranceAccuracyIndicatorTitle;
                break;
            default:
                this.accuracyType = '';
                this.title = '';
                break;
        }
        return this.accuracyType;
    }
}

export = AccuracyIndicator;
