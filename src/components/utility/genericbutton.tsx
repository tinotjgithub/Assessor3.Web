/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import enums = require('./enums');
import localeStore = require('../../stores/locale/localestore');

interface Props extends LocaleSelectionBase, PropsBase {
    title?: string;
    content?: string;
    className?: string;
    tabIndex?: number;
    disabled?: boolean;
    childrens?: Array<JSX.Element>;
    onClick?: Function;
    onDoubleClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseOver?: Function;
    buttonType?: enums.ButtonType;
}

/**
 * React component class for Generic button implementation.
 */
class GenericButton extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        let buttonElement: JSX.Element;
                buttonElement = (<button id={this.props.id}
                    title={this.props.title}
                    className={this.props.className}
                    onClick={this.onClick}
                    disabled={this.props.disabled}
                    onDoubleClick={this.onDoubleClick}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onMouseOver={this.onMouseOver}>
                    {this.props.content}
                    {this.props.childrens != null ? this.props.childrens : null}
                </button>);
        return buttonElement;
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        applicationStore.instance.setMaxListeners(0);
    }

    /**
     * Handles the single click event.
     * @param evnt
     */
    private onClick(evnt: any) {
        if (this.props.onClick != null) {
            this.props.onClick(evnt);
        }
    }

    /**
     * Handles the double click event.
     * @param evnt
     */
    private onDoubleClick(evnt: any) {
        if (this.props.onDoubleClick != null) {
            this.props.onDoubleClick();
        }
    }

    /**
     * Handles the mouse enter event.
     * @param evnt
     */
    private onMouseEnter(evnt: any) {
        if (this.props.onMouseEnter != null) {
            this.props.onMouseEnter();
        }
    }

    /**
     * Handles the mouse leave event.
     * @param evnt
     */
    private onMouseLeave(evnt: any) {
        if (this.props.onMouseLeave != null) {
            this.props.onMouseLeave();
        }
    }

    /**
     * Handles the mouse over event.
     * @param evnt
     */
    private onMouseOver(evnt: any) {
        if (this.props.onMouseOver != null) {
            this.props.onMouseOver();
        }
    }
}

export = GenericButton;