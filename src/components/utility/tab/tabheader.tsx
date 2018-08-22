/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
let classNames = require('classnames');

/* tslint:disable:no-reserved-keywords */
/**
 * Properties of the Tab header component
 */
interface Props extends LocaleSelectionBase {
    index: number;
    key: string;
    id: string;
    class: string;
    isSelected: boolean;
    isDisabled: boolean;
    tabNavigation: string;
    headerCount: number;
    isHeaderCountNotRequired?: boolean;
    headerText: string;
    selectTab: Function;
}
/* tslint:disable:no-reserved-keywords */

/**
 * Represents the Tab header Compoent
 */
class TabHeader extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Render method for Tab header.
     */
    public render(): JSX.Element {

        return (
            <li className={ this.getClassNames() }
                id={this.props.id}
                key={'key_' + this.props.id}
                role='tab'
                aria-selected={this.props.isSelected}
                onClick={ this.handleClick }>
                <a href='javascript:void(0)'
                    data-tab-nav={this.props.tabNavigation}
                    aria-controls={this.props.tabNavigation}
                    className = 'arrow-link'>
                    <span className='tab-text-holder'>
                        {this.HeaderCount()}
                        <span className = 'tab-text' >{this.props.headerText}</span>
                        </span>
                    </a>
                </li>
        );
    }
    /**
     * This method will update the state.
     */
    private handleClick() {
        if (this.props.isDisabled !== true) {
            this.props.selectTab(this.props.index);
        }
    }

    /**
     * This method will return count visible status
     */
    private HeaderCount(): JSX.Element {
        return this.props.isHeaderCountNotRequired ? null :
            (<span className='response-count count'>{this.props.headerCount}</span>);
    }

    /**
     * This method will return class name depend on disable required status
     */
    private getClassNames(): string {
        return this.props.isHeaderCountNotRequired ? (classNames(this.props.class, { ' active': this.props.isSelected })) :
        (classNames(this.props.class, { ' active': this.props.isSelected }, { ' disabled': this.props.isDisabled }));

    }
}
export = TabHeader;