/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onChangeViewClick: Function;
    isActive: boolean;
    changeViewIconClass: string;
    changeViewIconText: string;
    changeViewTooltip: string;
}

/**
 * MarkingViewButton class
 * @param {Props} props
 * @param {any} any
 * @returns
 */
class FullResponseViewOption extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.changeViewClick = this.changeViewClick.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        return (<li className={this.props.isActive === true ? 'active' : ''}>
            <a className='page-view-link' onClick={this.changeViewClick}
                title={this.props.changeViewTooltip}>
                <span className={this.props.changeViewIconClass} />
                <span className='view-icon-text'>
                    {this.props.changeViewIconText}
                </span>
            </a>
        </li>);
    }

    /**
     * Handling the respose view option click.
     * @param {any} evnt
     */
    private changeViewClick(evnt: any): void {
        this.props.onChangeViewClick();
    }
}

export = FullResponseViewOption;