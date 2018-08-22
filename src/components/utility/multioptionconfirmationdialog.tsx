/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDOM = require('react-dom');
/* tslint:disable:no-unused-variable */
let classNames = require('classnames');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import userOptionsActionCreator = require('../../actions/useroption/useroptionactioncreator');
import moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
import modulekeys = require('../../utility/generic/modulekeys');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import enums = require('./enums');
import constants = require('./constants');

interface Props extends LocaleSelectionBase {
    header: string;
    content: JSX.Element[];
    displayPopup: boolean;
    onCancelClick: Function;
    onYesClick: Function;
    onNoClick?: Function;
    isKeyBoardSupportEnabled?: boolean;
    popupSize: enums.PopupSize;
    popupType: enums.PopUpType;
    buttonYesText: string;
    buttonNoText?: string;
    buttonCancelText: string;
    displayNoButton: boolean;
    isClassifyResponseOkButtonDisabled?: boolean;
}

var controlsEnum = { none: 0, cancel: 1, no: 2, yes: 3 };

/**
 * React component class for Header for Authorized pages
 */
class MultiOptionConfirmationDialog extends pureRenderComponent<Props, any> {
    public focusedItem: any = controlsEnum.none;
    private id: string;

    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);

        this.keyHandler = this.keyHandler.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onPopupNoClick = this.onPopupNoClick.bind(this);
        this.onYesClick = this.onYesClick.bind(this);
        this.onNoClick = this.onNoClick.bind(this);
    }

    /** refs */
    public refs: {
        [key: string]: (Element);
        noButton: (HTMLButtonElement);
        yesButton: (HTMLButtonElement);
        cancelButton: (HTMLButtonElement);
    };

    /**
     * Render method
     */
    public render() {

        if (this.props.displayPopup) {
            if (this.props.isKeyBoardSupportEnabled) {
                let keyDownHandler: moduleKeyHandler = new moduleKeyHandler(
                    modulekeys.POPUP_KEY_DOWN,
                    enums.Priority.Second,
                    true,
                    this.keyHandler,
                    enums.KeyMode.down);
                keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);

                let keyPressHandler: moduleKeyHandler = new moduleKeyHandler(
                    modulekeys.POPUP_KEY_PRESS,
                    enums.Priority.Second,
                    true,
                    this.keyHandler,
                    enums.KeyMode.press);
                keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
            }

            let prefix: string;
            switch (this.props.popupType) {
                case enums.PopUpType.AtypicalSearch:
                prefix = 'atypicalSearch';
                break;
                case enums.PopUpType.SelectToMarkAsProvisional:
                prefix = 'selectToMark';
                break;
                case enums.PopUpType.ReclassifyMultiOption:
                prefix = 'ReclassifyMultiOption';
                break;
                case enums.PopUpType.ShareResponse:
                prefix = 'shareResponse';
                break;
                case enums.PopUpType.ReuseRigAction:
                prefix = 'reuseRig';
                break;
                default:
                break;
            }

            let noButtonEl: JSX.Element;
            if (this.props.displayNoButton) {
                noButtonEl = (<button autoFocus = {false}
                    onClick={this.onNoClick}
                    id={'popup_' + prefix + 'Messge_move_to_worklist_button'}
                    className='button rounded'
                    ref = {'noButton'}>
                    {this.props.buttonNoText}</button>);
            }

            return (
                <div className = {classNames('popup popup-overlay close-button popup-open open',
                    enums.getEnumString(enums.PopupSize, this.props.popupSize).toLowerCase())}
                    id= { this.id }
                    role='dialog'
                    aria-labelledby='popup42Title'
                    aria-describedby='popup42Desc'
                    onClick={ this.onPopupNoClick }>
                    <div className='popup-wrap' onClick={this.onPopupClick}>
                        <div className='popup-header bold-header-txt'>
                            <h4 id='popup42Title'>{this.props.header}</h4>
                            </div>
                        <div className='popup-content content-with-radio-btn' id='popup42Desc' key='popup14Desc'>
                            <p>{this.props.content}</p>
                            </div>
                        <div className='popup-footer text-right'>
                            <button onClick={this.onCancelClick}
                                id={'popup_' + prefix + 'Messge_cancel_button'}
                                ref = {'cancelButton'}
                                className='button rounded close-button'>
                                {this.props.buttonCancelText}</button>
                            {noButtonEl}
                            <button autoFocus = {true}
                                onClick={this.onYesClick}
                                id={'popup_' + prefix + 'Messge_mark_now_button'}
                                className='button primary rounded'
                                ref={'yesButton'}
                                disabled={this.props.isClassifyResponseOkButtonDisabled}>
                                {this.props.buttonYesText}</button>
                            </div>
                        </div>
                    </div>);
        } else {
            return null;
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillUnmount() {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
    }

    /**
     * Event fired on clicking 'No'
     * @param evnt
     */
    private onCancelClick(evnt: any) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        /** Should be true and rerender once the user changed (turn on) the ask on logout from panel and logging out */
        this.setState({ isAskOnLogOutChecked: true });
        this.props.onCancelClick();
    }

    /**
     * Event fired on clicking 'Yes'
     * @param evnt
     */
    private onNoClick(evnt: any) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        this.props.onNoClick();
    }

    /**
     * Event fired on clicking 'MarkNow'
     * @param evnt
     */
    private onYesClick(evnt: any) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        this.props.onYesClick();
    }

    /**
     * Event fired on clicking popup
     * @param evnt
     */
    private onPopupClick(evnt: any) {
        evnt.stopPropagation();
        return false;
    }

    /**
     * Event fired on clicking 'No' of popup
     * @param evnt
     */
    private onPopupNoClick(evnt: any) {
        this.onPopupClick(evnt);
    }

    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    private keyHandler(event: KeyboardEvent): boolean {

        let key = event.keyCode || event.charCode;
        // Handling the tab key for toggling the yes and no button focus.
        if (key === enums.KeyCode.tab) {
            switch (this.focusedItem) {
                case controlsEnum.cancel:
                    this.refs.noButton.focus();
                    this.focusedItem = controlsEnum.no;
                    break;
                case controlsEnum.no:
                    this.refs.yesButton.focus();
                    this.focusedItem = controlsEnum.yes;
                        break;
                case controlsEnum.yes:
                    this.refs.cancelButton.focus();
                    this.focusedItem = controlsEnum.cancel;
                    break;
                case controlsEnum.none:
                    this.refs.cancelButton.focus();
                    this.focusedItem = controlsEnum.cancel;
                    break;
            }
        }
        // If enter key pressed firing action based on focused element.
        if (key === enums.KeyCode.enter) {
            switch (this.focusedItem) {
                case controlsEnum.cancel:
                    this.onCancelClick(event);
                    break;
                case controlsEnum.no:
                    this.onNoClick(event);
                    break;
                case controlsEnum.yes:
                    this.onYesClick(event);
                    break;
            }
        } else if (key === enums.KeyCode.backspace) {

            keyDownHelper.KeydownHelper.stopEvent(event);
            return true;
        }
        /** to disbale the response navigation on confirmation popups (reset marks and annotation) */
        if (key === enums.KeyCode.left || key === enums.KeyCode.right) {
            keyDownHelper.KeydownHelper.stopEvent(event);
        }

        return true;
    }
}

export = MultiOptionConfirmationDialog;