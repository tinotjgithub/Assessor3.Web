/* tslint:disable:no-unused-variable */
import React = require('react');
import totalMark = require('./totalmark');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import markingstore = require('../../../stores/marking/markingstore');
import localeStore = require('../../../stores/locale/localestore');

/**
 * React component
 * @param {Props} props
 */
class TotalMarkTile extends totalMark {

	/**
	 * Constructor for TotalMarkTile
	 * @param props
	 * @param state
	 */
    constructor(props: any, state: any) {
        super(props);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        if (this.props.isNonNumericMark || this.props.markingProgress === 0) {
            return null;
        }
        let hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ComplexOptionality,
            markingstore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;
        let totalprogress = this.props.markingProgress;
        let result = <span></span>;
        let totalmark: string;
        //Hide totalmark based on cc value and totalprogress.
        if (hasComplexOptionality && totalprogress < 100) {
            totalmark = '...';
            result = (<span title={this.getTranslated('marking.worklist.complex-optionality.total-marks')} className='large-text'
                id={'totalMark_' + this.props.id}>{totalmark}</span>);
        } else {
            totalmark = this.props.totalMark.toLocaleString(this.currentLocale);
            result = (<span className='large-text' id={'totalMark_' + this.props.id}>{totalmark}</span>);
        }
        return (<p className='resp-mark small-text'>
            <span className='dim-text'>{this.getTranslated('marking.worklist.list-view-column-headers.total-mark') + ':'}</span>
            {result}
        </p>);
    }
}

export = TotalMarkTile;
