/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import enums = require('../utility/enums');
import keydownHelper = require('../../utility/generic/keydownhelper');
import ErrorDialogBase = require('./errordialogbase');
/**
 * Props of ErrorDialog component
 */
interface Props extends LocaleSelectionBase {
    content: string;
    viewMoreContent: string;
    isOpen?: boolean;
    onOkClick: Function;
    isCustomError: boolean;
    header: string;
    showErrorIcon: boolean;
}

/**
 * State of ErrorDialog component
 */
interface State {
    isViewMoreOpen?: enums.Tristate;
}

/**
 * React component class for Header for Authorized pages
 */
class ErrorDialog extends ErrorDialogBase {

    /**
     * Constructor ErrorDialog
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isViewMoreOpen: enums.Tristate.notSet
        };
        this.onOkClick = this.onOkClick.bind(this);
    }

    /**
     * Render
     */
    public render() {
        if (this.props.isOpen) {
            return (
                <div
                    id= 'errorPopup'
                    role= 'dialog'
                    aria-labelledby='popup5Title'
                    aria-describedby='popup5Desc'
                    className={classNames(
                        'popup small popup-overlay close-button error-popup',
                        {
                            'open': this.props.isOpen,
                            'close': !this.props.isOpen
                        }
                    ) }
                    >
                    <div className='popup-wrap'>
                        {this.renderErrorDialogHeader()}
                        {this.renderContent()}
                        {this.renderOKButton()}
                    </div>
                </div >
            );
        } else {
            return null;
             }
    }

    /**
     * To render the content of error dialog
     */
    private renderContent(): JSX.Element {
        return (
            <div className='popup-content' id='popup5Desc'>
                <div className={classNames({
                    'indented': this.props.showErrorIcon
                })} >
                    <p>{this.props.content}</p>
                </div>
                {this.renderMoreInfo()}
            </div>
        );

    }
}

export = ErrorDialog;