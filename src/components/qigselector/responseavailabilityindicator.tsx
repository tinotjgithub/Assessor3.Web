/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import qigValidationResultBase = require('../../stores/qigselector/qigvalidationresultbase');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');
import aggregatedQigValidationResult = require('../../stores/qigselector/aggregatedqigvalidationresult');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    qigValidationResult: qigValidationResultBase;
}

/**
 * Class for the Response Available Indicator section
 */
class ResponseAvailabilityIndicator extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for Respons eAvailable Indicator.
     */
    public render() {
        if (this.props.qigValidationResult.displayOpenResponseIndicator) {
            return (
                <span title={this.getTooltipTitle}
                    key={this.props.id + '_downloadedIndicator'} id={this.props.id + '_downloadedIndicator'}
                    className='sprite-icon downloaded-indicator-icon not-clickable'></span>
            );
        } else if (this.props.qigValidationResult.displayResponseAvailableIndicator) {
            return (
                <span title={localeStore.instance.TranslateText('home.qig-data.responses-available-icon-tooltip')}
                    key={this.props.id + '_downloadIndicator'} id={this.props.id + '_downloadIndicator'}
                    className='sprite-icon download-indicator-icon not-clickable'></span>
            );
        } else {
            return null;
        }
    }
    /**
     * Get the tooltip description When the mouse pointer is positioned over Responses Available indicator.
     */
    private get getTooltipTitle() {
        let validationResult;
        // Casting to the type of validation result.
        if (this.props.qigValidationResult instanceof aggregatedQigValidationResult ){
            validationResult = this.props.qigValidationResult as aggregatedQigValidationResult;
        } else {
            validationResult = this.props.qigValidationResult as qigValidationResult;
        }

        if (validationResult.isSimulationMode) {
            return localeStore.instance.TranslateText('home.qig-data.responses-available-simulation-icon-tooltip');
        } else {
            return localeStore.instance.TranslateText('home.qig-data.responses-in-worklist-icon-tooltip');
        }
    }
}


export = ResponseAvailabilityIndicator;
