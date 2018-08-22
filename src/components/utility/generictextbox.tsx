/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
// non-typescript require
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
import enums = require('../utility/enums');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    setValue: Function;
    value: string;
    tabindex: number;
    onEnterKeyDown?: Function;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    currentValue?: string;
    hasError?: boolean;
}

/**
 * React component class for GenericTextBox
 */
class GenericTextBox extends pureRenderComponent<Props, State> {

    /** refs */
    public refs: {
        [key: string]: (Element);
        genericTextBox: (HTMLInputElement);
    };

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            currentValue: this.props.value
        };

        this.handleChange = this.handleChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    /**
     * Render method
     */
    public render() {
        return (
                <input type='text'
                    className='text-underline'
                    id={this.props.id}
                    value={this.state.currentValue}
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onKeyDown={this.handleKeyDown}
                    spellCheck={false}
                    aria-label={this.props.id}
                    ref={'genericTextBox'} />
        );
    }

    /**
     * This method will set value for login form
     * @param e
     */
    private handleChange(e: any): void {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value);
    }

    /**
     * Handles the On focus
     * @param {any} e
     */
    private onFocus(e: any): void {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value);
    }

    /**
     * Checking if Enter key is pressed
     * @param {any} e
     */
    private handleKeyDown(e: any): void {
        if (e.keyCode === 13) {
            this.props.onEnterKeyDown();
        }
    }

    /**
     * This will set state hasError based on props value
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        this.setState({ currentValue: nxtProps.value }, () => {
            this.refs.genericTextBox.focus();
        });
    }

}

export = GenericTextBox;