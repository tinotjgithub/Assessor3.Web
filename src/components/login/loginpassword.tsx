/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
// non-typescript require
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
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
    hasCapsLockWarning?: boolean;
    currentValue?: string;
    hasError?: boolean;
}

/**
 * React component class for Login
 */
class LoginPassword extends pureRenderComponent<Props, State> {
    //This variable is using to track the capslock button state on page level
    private _isCapsLockOn: boolean = false;
    private _hasFocus: boolean = false;
    private _boundHandleKeyDown: EventListenerObject = null;
    private _boundHandleKeyPress: EventListenerObject = null;
    // variable to set Password textbox to readonly - prevent setting if IE
    private _readOnly: boolean = false;

    /**
     * Constructor LoginPassword
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            currentValue: this.props.value,
            hasCapsLockWarning: false,
            hasError: this.props.error
        };

        this.handleChange = this.handleChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this._boundHandleKeyDown = this.handleKeyDown.bind(this);
        this._boundHandleKeyPress = this.checkCapsLock.bind(this);
        this.setReadOnlyForBrowser();
    }

    /**
     * Render component
     * @returns
     */
    public render() {

        /* Onchange event is not working in IE11 while copying and pasting the credentials due to a defect in React, so that we've chage
        that event to OnInput - Defect fix: #37753 */
        let input = htmlUtilities.isIE11 ?
            <input type='password' aria-describedby='password-tip'
                className={ classNames('text-underline',
                    { 'bubble-on': this.state.hasCapsLockWarning, 'error': this.state.hasError }) }
                id={this.props.id}
                value={this.state.currentValue}
                onInput = {this.handleChange}
                onFocus = {this.onFocus}
                onBlur = {this.onBlur}
               // tabIndex = {this.props.tabindex}
                required
				readOnly={this._readOnly}
				autoComplete='off' /> :
            <input type='password' aria-describedby='password-tip'
                className={ classNames('text-underline',
                    { 'bubble-on': this.state.hasCapsLockWarning, 'error': this.state.hasError }) }
                id={this.props.id}
                value={this.state.currentValue}
                onChange = {this.handleChange}
                onFocus = {this.onFocus}
                onBlur = {this.onBlur}
               // tabIndex = {this.props.tabindex}
                required
				readOnly={this._readOnly}
				autoComplete='off' />;

        return (
            <div className= 'relative' >
                { input }
                <label htmlFor='passwordBox'>{localeStore.instance.TranslateText('login.login-page.password') }</label>
                <span className='sprite-icon password-icon'></span>
                <span className='bar'></span>
                <span className='bubble callout capslock-on info-alert'>
                    <span className='bubble-text' id='password-tip'>
                        {localeStore.instance.TranslateText('login.login-page.caps-lock-on-warning') }
                    </span>
                </span>
            </div >
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        window.addEventListener('keydown', this._boundHandleKeyDown);
        // attaching keyup event listner to solve MAC capslock indicator issue.
        // keydown event is not firing in MAC machine while pressing CapsLock button off.
        if (navigator.platform.indexOf('Mac') > -1) {
            window.addEventListener('keyup', this._boundHandleKeyDown);
        }
        window.addEventListener('keypress', this._boundHandleKeyPress);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        window.removeEventListener('keydown', this._boundHandleKeyDown);
        // detaching keyup event listner to solve MAC capslock indicator issue.
        // keydown event is not firing in MAC machine while pressing CapsLock button off.
        if (navigator.platform.indexOf('Mac') > -1) {
            window.removeEventListener('keyup', this._boundHandleKeyDown);
        }
        window.removeEventListener('keypress', this._boundHandleKeyPress);
    }

    /**
     * This will set state hasError based on props value
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        this.setState({ hasError: nxtProps.error });
    }

    /**
     * This method will set the current value.
     * Also this will set password for login form.
     * @param e
     */
    private handleChange(e: any): void {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value, enums.LoginForm.password);
    }

    /**
     * This method will check whether the CapsLock button is on or not
     * @param e
     */
    private checkCapsLock(e: any): void {
        let s = String.fromCharCode(e.which);
        if ((s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) || //caps is on
            (s.toUpperCase() !== s && s.toLowerCase() === s && e.shiftKey)) {
            this._isCapsLockOn = true;
            if (this._hasFocus) {
                this.setCapsLockIndicator(true);
            }
        } else if ((s.toLowerCase() === s && s.toUpperCase() !== s && !e.shiftKey) ||
            (s.toLowerCase() !== s && s.toUpperCase() === s && e.shiftKey)) { //caps is off
            this._isCapsLockOn = false;
            if (this._hasFocus) {
                this.setCapsLockIndicator(false);
            }
        }
    }

    /**
     * This method will display the CapsLock indicator if CapsLock button pressed and
     *  Password box has focus.
     * @param e
     */
    private handleKeyDown(e: any): void {
        // CapsLock keycode - 20
        if (e.keyCode === 20) {
            this._isCapsLockOn = !this._isCapsLockOn;
            if (this._hasFocus) {
                this.setCapsLockIndicator(this._isCapsLockOn);
            }
        }
    }

    /**
     * This method will call on focus
     * @param e
     */
    private onFocus(e: any): void {
        //to remove IE's default capslock on warning
        document.msCapsLockWarningOff = true;
        e.target.removeAttribute('readOnly');
        this._hasFocus = true;
        if (this.state.hasError) {
            this.setState({ hasError: false });
        }
        if (!this.state.hasCapsLockWarning) {
            this.setCapsLockIndicator(this._isCapsLockOn);
        }
    }

    /**
     * This method will hide the CapsLock indicator on focus out
     * @param e
     */
    private onBlur(e: any): void {
        this._hasFocus = false;
        if (this.state.hasCapsLockWarning) {
            this.setCapsLockIndicator(false);
        }
    }

    /**
     * This method will set the CapsLock indicator status
     * @param show
     */
    private setCapsLockIndicator(show: boolean): void {
        this.setState({ hasCapsLockWarning: show });
    }

    /**
     * Set readonly true only for Chrome browser.
     */
    private setReadOnlyForBrowser = (): void => {
        if (htmlUtilities.getUserDevice().browser === 'Chrome') {
            this._readOnly = true;
        } else {
            this._readOnly = false;
        }
    };
}

export = LoginPassword;


