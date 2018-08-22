/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import markingstore = require('../../../stores/marking/markingstore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isNonNumericMark: boolean;
    maximumMark: number;
    totalMark: number;
    markingProgress: number;
}

/**
 * React component
 * @param {Props} props
 */
class TotalMark extends pureRenderComponent<Props, any> {

    /**
     * Constructor for total mark
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * getTotalMarkOutput
     */
    protected getTotalMarkOutput(): any {
        let result = <span></span>;
        let totalmark;
        let hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ComplexOptionality,
            markingstore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;
        if (this.props.markingProgress === 0) {

            result = (
                <span className='large-text dark-link' id={'totalMark_' + this.props.id}>--</span>
            );
        } else if (this.props.isNonNumericMark) {
            result = (
                <span className='large-text dark-link' id={'totalMark_' + this.props.id}>N/A</span>
            );
        } else if (hasComplexOptionality && this.props.markingProgress < 100) {
            //Hide totalmark based on cc value and totalprogress.
            totalmark = '...';
            result = (<span title={this.getTranslated('marking.worklist.complex-optionality.total-marks')}
                className='large-text dark-link' id={'totalMark_' + this.props.id}>{totalmark}</span>);
        } else {
            totalmark = this.props.totalMark.toLocaleString(localeStore.instance.Locale);
            result = (<span className='large-text dark-link' id={'totalMark_' + this.props.id}>{totalmark}</span>);
        }
        return result;
    }

	/*
	 * Get the locale
	*/
	protected get currentLocale(): string {
		return localeStore.instance.Locale;
	}

	/**
	 * Translate the text
	 * @param value
	 * @returns Localised string
	 */
	protected getTranslated(value: string): string {
		return localeStore.instance.TranslateText(value);
	}
}

export = TotalMark;
