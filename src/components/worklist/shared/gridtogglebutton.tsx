/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
let classNames = require('classnames');
import enums = require('../../utility/enums');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    toggleGridView: Function;
    isSelected: boolean;
    buttonType: enums.GridType;
}

/**
 * React component
 * @param {Props} props
 */
class GridToggleButton extends pureRenderComponent<Props, any> {

    /**
     * Constructor for Grid toggle button
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.toggleView = this.toggleView.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        let buttonTitle;
        let iconStyle;
        let click: React.EventHandler<any>;
        let _class;
        if (this.props.buttonType === enums.GridType.tiled) {
            buttonTitle = localeStore.instance.TranslateText('marking.worklist.view-switcher.tile-view');
            iconStyle = 'sprite-icon tile-view-icon';
        } else if (this.props.buttonType === enums.GridType.detailed) {
            buttonTitle = localeStore.instance.TranslateText('marking.worklist.view-switcher.list-view');
            iconStyle = 'sprite-icon grid-view-icon';
        } else if (this.props.buttonType === enums.GridType.markByQuestion) {
            buttonTitle = localeStore.instance.TranslateText('standardisation-setup.view-switcher.mark-by-question-view');
            iconStyle = 'sprite-icon view-total-mark-icon';
        } else if (this.props.buttonType === enums.GridType.totalMarks) {
            buttonTitle = localeStore.instance.TranslateText('standardisation-setup.view-switcher.total-mark-view');
            iconStyle = 'sprite-icon grid-view-icon';
        }

        if (this.props.isSelected) {
            _class = 'switch-view active';
            click = null;
        } else {
            _class = 'switch-view';
            click = this.toggleView;
        }

        return (

            <a href='javascript:void(0)' title={buttonTitle}
                key={'key_' + this.props.id}
                id={this.props.id}
                onClick={click }
                className={_class} >
                    <span  className={iconStyle} ></span>
                    <span className='view-text' id = {this.props.id + '_ToggleText'}>{buttonTitle}</span>
                </a>
        );
    }

    /**
     * this will toggle the grid view (tile/detail).
     */
    private toggleView(evnt: any) {
        this.props.toggleGridView();
    }

}

export = GridToggleButton;
