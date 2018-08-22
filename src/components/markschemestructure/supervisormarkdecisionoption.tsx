/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import constants = require('../utility/constants');
import SupervisorMarkDecisionButton = require('./supervisormarkdecisionbutton');
import enums = require('../../components/utility/enums');
import worklistStore = require('../../stores/worklist/workliststore');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import Immutable = require('immutable');
let classNames = require('classnames');

interface Props extends LocaleSelectionBase, PropsBase {
    decisionText: string;
    isSelected: boolean;
    onOptionClick: Function;
    remarkDecisionType: enums.SupervisorRemarkDecisionType;
}

class SupervisorMarkDecisionOption extends pureRenderComponent<Props, any>  {

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onOptionClick = this.onOptionClick.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        return (
            <li onClick = {this.onOptionClick} >
                <input type='radio' value='selected' name='remarkDecision' checked={ this.props.isSelected }
                    disabled={this.isClosedOrTeamManagement}/>
                <label htmlFor='decideLater' className={(this.isClosedOrTeamManagement) ? 'disabled' : ''}>
                    <span className='radio-ui'></span><span className='label-text'>{this.props.decisionText}</span>
                </label>
            </li>
        );
    }

    /**
     * triggers on radio button click
     */
    private onOptionClick = (event: any): void => {
        event.stopPropagation();
        if (!this.isClosedOrTeamManagement) {
            this.props.onOptionClick(this.props.remarkDecisionType);
        }
    };

    /**
     * returns whether the response is closed or in team management
     */
    private get isClosedOrTeamManagement(): boolean {
        return (worklistStore.instance.getResponseMode === enums.ResponseMode.closed
            || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement);
    }

}

export = SupervisorMarkDecisionOption;
