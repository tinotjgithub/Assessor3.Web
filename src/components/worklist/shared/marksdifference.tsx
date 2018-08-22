/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');
import constants = require('../../utility/constants');

/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    className?: string;
    title?: string;
    marksDifference?: number;
    marksDifferenceText?: string;
    marksDifferenceType: enums.MarksDifferenceType;
    isTileView?: boolean;
}

class MarksDifference extends PureRenderComponent<Props, any> {

    /**
     * Constructor for MarksDifference
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        if (this.props.isTileView === false) {
            return (<div id={this.props.id} className={this.props.className} title={localeStore.instance.TranslateText(this.props.title) }>
                <span className='dim-text txt-val'>{ this.getMarkDifferenceValueInStringFormat() }</span>
            </div>);
        } else {
            return (<div id={this.props.id} className={this.props.className} title={localeStore.instance.TranslateText(this.props.title) }>
                <span className='ex-dim-text txt-label'>{localeStore.instance.TranslateText(this.props.marksDifferenceText) } </span>
                <span className='dim-text txt-val'>{ this.getMarkDifferenceValueInStringFormat() }</span>
            </div>);
        }
    }

    /**
     * Get mark difference value in string format.
     */
    private getMarkDifferenceValueInStringFormat(): string {
        let displayMarkDifferenceValue: string = '';
        let markDifferenceValue: number = this.props.marksDifference !== undefined ? this.props.marksDifference : 0;

        switch (this.props.marksDifferenceType) {
            case enums.MarksDifferenceType.TotalMarksDifference:
                displayMarkDifferenceValue = this.props.marksDifference > 0
                    ? (constants.PLUS_SIGN + this.props.marksDifference) : markDifferenceValue.toString();
                break;
            default:
                displayMarkDifferenceValue = markDifferenceValue.toString();
        }

        return displayMarkDifferenceValue;
    }
}

export = MarksDifference;

