/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
// non-typescript require
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
import enums = require('../utility/enums');
import htmlUtilities = require('../../utility/generic/htmlutilities');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    setValue: Function;
    error: boolean;
    value: string;
    tabindex: number;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    currentValue?: string;
    hasError?: boolean;
}

/**
 * React component class for Login
 */
class LoginUserName extends pureRenderComponent<Props, State> {

    /**
     * Constructor LoginUserName
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            currentValue: this.props.value,
            hasError: this.props.error
        };

        this.handleChange = this.handleChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    /**
     * Render method
     * @returns
     */
    public render() {
        /* Onchange event is not working in IE11 while copying and pasting the credentials due to a defect in React, so that we've chage
        that event to OnInput - Defect fix: #37753 */
        let input = htmlUtilities.isIE11 ?
            <input type='text'
                required
                className={ classNames('text-underline', { 'error': this.state.hasError }) }
                id={this.props.id}
                defaultValue={this.state.currentValue}
                onInput={this.handleChange}
               // tabIndex = {this.props.tabindex}
                onFocus={this.onFocus}
                spellCheck = {false}
				autoFocus={true}
				autoComplete='off' /> :
            <input type='text'
                required
                className={ classNames('text-underline', { 'error': this.state.hasError }) }
                id={this.props.id}
                defaultValue={this.state.currentValue}
                onChange={this.handleChange}
                //tabIndex = {this.props.tabindex}
                onFocus={this.onFocus}
                spellCheck = {false}
				autoFocus={true}
				autoComplete='off' />;

        return (
            <div className='relative'>
                    { input }
                    <label htmlFor='usernameBox'>{localeStore.instance.TranslateText('login.login-page.username') }</label>
                    <span className='sprite-icon username-icon'></span>
                    <span className='bar'></span>
                </div>
        );
    }

    /**
     * This method will set the error state.
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        this.setState({ hasError: nxtProps.error });
    }

    /**
     * This method will set value for login form
     * @param e
     */
    private handleChange(e: any): void {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value, enums.LoginForm.username);
    }

    /**
     * This method will reset error style on focus
     * @param e
     */
    private onFocus(e: any): void {
        if (this.state.hasError) {
            this.setState({ hasError: false });
        }
    }

}

export = LoginUserName;


