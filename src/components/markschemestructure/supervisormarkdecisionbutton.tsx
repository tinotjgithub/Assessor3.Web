/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');

interface Props extends LocaleSelectionBase, PropsBase {
    isReadonly: boolean;
    onButtonClick: Function;
}

class SupervisorMarkDecisionButton extends pureRenderComponent<Props, any>  {

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        let buttonClass = classNames('sprite-icon',
            {
                'edit-box-yellow-icon': !this.props.isReadonly,
                'edit-box-icon': this.props.isReadonly
            });
        return (
            <a href='javascript:void(0)'
                className='eur-reason-link menu-button'
                id={this.props.id}
                title={(this.props.isReadonly) ?
                    localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.decision-tooltip')
                    : localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.no-decision-tooltip')}
                onClick={this.onButtonClick}>
                <span className={buttonClass} ></span>
            </a>
        );
    }

    /**
     * Triggers on decision button click
     */
    private onButtonClick(event: any): void {
        this.props.onButtonClick(event);
    }
}

export = SupervisorMarkDecisionButton;
