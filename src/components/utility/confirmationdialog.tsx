/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDOM = require('react-dom');
/* tslint:disable:no-unused-variable */
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
import responseStore = require('../../stores/response/responsestore');
import promoteToSeedReturn = require('../../stores/response/typings/promotetoseedreturn');
import stringHelper = require('../../utility/generic/stringhelper');

interface Props extends LocaleSelectionBase {
    header: string;
    content: string;
    displayPopup: boolean;
    onYesClick: Function;
    onNoClick: Function;
    yesButtonText: string;
    noButtonText: string;
    isCheckBoxVisible: boolean;
    isKeyBoardSupportEnabled?: boolean;
    dialogType: enums.PopupDialogType;
}

interface State {
    isAskOnLogOutChecked: boolean;
}

/**
 * React component class for Header for Authorized pages
 */
class ConfirmationDialog extends pureRenderComponent<Props, State> {
    private isYesButtonFocussed: boolean = true;
    private id: string;
    private allPageNotAnnotated: string = 'allPagenotAnnotated';
    private markChangeReasonNeeded: string = 'MarkChangeReasonNeeded';

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isAskOnLogOutChecked: true
        };

        this.keyHandler = this.keyHandler.bind(this);
        this.onNoClick = this.onNoClick.bind(this);
        this.onPopupClick = this.onPopupClick.bind(this);
        this.onYesButtonBlur = this.onYesButtonBlur.bind(this);
        this.onYesClick = this.onYesClick.bind(this);
        this.onAskOnLogOutClick = this.onAskOnLogOutClick.bind(this);
    }

    /** refs */
    public refs: {
        [key: string]: (Element);
        askEveryTime: (HTMLInputElement);
        noButton: (HTMLButtonElement);
        yesButton: (HTMLButtonElement);
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

            switch (this.props.dialogType) {
                case enums.PopupDialogType.LogoutConfirmation:
                    this.id = 'logoutPopup';
                    break;
                case enums.PopupDialogType.MbCReturnToWorklistConfirmation:
                    this.id = 'mbCConfirmationDialog';
                    break;
                case enums.PopupDialogType.AllPageNotAnnotated:
                    this.id = 'allPagenotAnnotated';
                    break;
                case enums.PopupDialogType.MarkChangeReasonError:
                    this.id = 'MarkChangeReasonNeeded';
                    break;
                case enums.PopupDialogType.UnlockExaminerConfirmation:
                    this.id = 'UnlockExaminerConfirmation';
                    break;
                case enums.PopupDialogType.PromoteToSeedConfirmation:
                case enums.PopupDialogType.PromoteToSeedRemarkConfirmation:
                    this.id = 'promote-to-seed';
                    break;
                case enums.PopupDialogType.UnmanagedSLAOFlagAsSeen:
                    this.id = 'UnmanagedSLAOFlagAsSeen';
                    break;
                case enums.PopupDialogType.AllSLAOsManaged:
                    this.id = 'AllSLAOsManaged';
                    break;
                case enums.PopupDialogType.CompleteMarkingCheck:
                    this.id = 'CompleteMarkingCheck';
                    break;
                case enums.PopupDialogType.ReviewOfSLAOConfirmation:
                    this.id = 'reviewOfSLAOConfirmation';
                    break;
                case enums.PopupDialogType.SimulationResponseSubmitConfirmation:
                    this.id = 'SimulationResponseSubmitConfirmation';
                    break;
                case enums.PopupDialogType.UnknownContentFlagAsSeen:
                    this.id = 'UnknownContentFlagAsSeenConfirmation';
                    break;
                case enums.PopupDialogType.ShareConfirmationPopup:
                    this.id = 'ShareConfirmationPopup';
                    break;
                case enums.PopupDialogType.WholeResponseRemarkConfirmation:
                    this.id = 'WholeResponseRemarkConfirmation';
                    break;
                case enums.PopupDialogType.ReviewOfUnknownContentConfirmation:
                    this.id = 'ReviewOfUnknownContentConfirmation';
                    break;
            }
            return (
                <div className={this.getClassName(this.props.yesButtonText, this.props.noButtonText)}
                    id={this.id}
                    role='dialog'
                    aria-labelledby='popup4Title'
                    aria-describedby='popup4Desc'>
                    <div className='popup-wrap' onClick={this.onPopupClick}>
                        <div className='popup-header'>
                            <h4 id='popup4Title'>{this.props.header}</h4>
                        </div>
                        <div className='popup-content' id='popup14Desc'>
                            {this.showRelevantContent()}
                            {this.showHideCheckbox()}
                        </div>
                        <div className='popup-footer text-right'>
                            <button onClick={this.onNoClick}
                                ref={'noButton'}
                                className='button rounded close-button'
                                title={this.props.noButtonText}
                                onBlur={this.onYesButtonBlur}>{this.props.noButtonText}</button>
                            <button autoFocus={true}
                                onClick={this.onYesClick}
                                className='button primary rounded'
                                ref={'yesButton'}
                                onBlur={this.onYesButtonBlur}
                                title={this.props.yesButtonText}>{this.props.yesButtonText}</button>
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

            // Focus inside popup for discard Message/Exception popup - #48497
            if (this.props.dialogType === enums.PopupDialogType.Exception) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            } else if (this.props.dialogType === enums.PopupDialogType.Message) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
            }
        }
    }

    /**
     * This function gets invoked after the component is mounted.
     */
    public componentDidMount() {
        if (this.props.isKeyBoardSupportEnabled) {
            // Focus inside popup for discard Message/Exception popup - #48497
            if (this.props.dialogType === enums.PopupDialogType.Exception) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            } else if (this.props.dialogType === enums.PopupDialogType.Message) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
            }
        }
    }

    /**
     *  This function gets invoked after the component is updated.
     */
    public componentDidUpdate() {
        if (this.props.displayPopup === true) {
            /* Need to set focus for yes button when the popup shown*/
            this.isYesButtonFocussed = true;
        }
    }

    /**
     * Event fired on clicking 'No'
     * @param evnt
     */
    private onNoClick(evnt: any) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        /** Should be true and rerender once the user changed (turn on) the ask on logout from panel and logging out */
        this.setState({ isAskOnLogOutChecked: true });
        this.props.onNoClick();
    }

    /**
     * Event fired on clicking 'Yes'
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
     * Ask on log out check box click
     */
    private onAskOnLogOutClick() {
        userOptionsHelper.save(userOptionKeys.ASK_ON_LOG_OUT, String(!this.state.isAskOnLogOutChecked), true);
        this.setState({ isAskOnLogOutChecked: !this.state.isAskOnLogOutChecked });
    }

    /**
     * show hide logout confirmation checkbox
     */
    private showHideCheckbox(): JSX.Element {
        let result: JSX.Element;
        if (this.props.isCheckBoxVisible) {
            result = (<div className='padding-top-30'>
                <input
                    className='text-middle checkbox'
                    id='askEveryTime' type='checkbox' ref={'askEveryTime'}
                    autoFocus={true}
                    checked={this.state.isAskOnLogOutChecked}
                    onChange={this.onAskOnLogOutClick}
                />
                <label
                    className='text-middle'
                    htmlFor='askEveryTime'>
                    {localeStore.instance.TranslateText('generic.logout-dialog.ask-every-time')}
                </label>
            </div>);
        } else {
            result = undefined;
        }
        return result;
    }

    /**
     * Setting focus to first element.
     */
    private onYesButtonBlur() {
        if (this.refs.askEveryTime !== undefined) {
            this.props.isCheckBoxVisible ? this.refs.askEveryTime.focus() : this.refs.noButton.focus();
        }
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
            this.isYesButtonFocussed ? this.refs.noButton.focus() : this.refs.yesButton.focus();
            this.isYesButtonFocussed = !this.isYesButtonFocussed;
        }
        // If enter key pressed firing action based on focused element.
        if (key === enums.KeyCode.enter) {
            if (this.isYesButtonFocussed) {
                this.onYesClick(event);
            } else {
                this.onNoClick(event);
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

    /**
     * This method will return the popup type class based on text size
     */
    private getClassName = (yesButtonText: string, noButtonText: string) => {
        let popupType: string = 'small';
        let yesButtonTextLength: number = yesButtonText.trim().length;
        let noButtonTextLength: number = noButtonText.trim().length;
        if (yesButtonTextLength >= constants.MEDIUM_POPUP_TEXT_SIZE || noButtonTextLength >= constants.MEDIUM_POPUP_TEXT_SIZE) {
            popupType = 'large';
        } else if ((yesButtonTextLength > constants.SMALL_POPUP_TEXT_SIZE && yesButtonTextLength < constants.MEDIUM_POPUP_TEXT_SIZE) ||
            (noButtonTextLength > constants.SMALL_POPUP_TEXT_SIZE && noButtonTextLength < constants.MEDIUM_POPUP_TEXT_SIZE)) {
            popupType = 'medium';
        }

        let popupClassName = 'popup ' + popupType + ' popup-overlay close-button popup-open open';

        return this.props.dialogType ===
            enums.PopupDialogType.MbCReturnToWorklistConfirmation ?
            popupClassName + ' return-worklist' : popupClassName;
    };

    /* tslint:disable:no-string-literal */
    /**
     * show relevant content for checkbox
     */
    private showRelevantContent(): JSX.Element {
        let result: JSX.Element;
        if (this.props.dialogType === enums.PopupDialogType.PromoteToSeedRemarkConfirmation) {
            let i: number = 0;
            var indents = [];
            let promoteToSeedReturnData = responseStore.instance.promoteseedremarkrequestreturn;
            for (; i < Object.keys(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds).length; i++) {
                indents.push(<div>
                    <span className='promote-seed-id table-cell'>
                        {'6' + promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds
                        [Object.keys(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds)[i]]
                        ['displayId']}</span>
                    <span className='promote-seed-desc table-cell'> - {
                        stringHelper.format(localeStore.instance.TranslateText(
                            this.getDirectedRemarkLocaleKey(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds[Object.keys
                                (promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds)[i]]
                            ['remarkTypeId'])), [constants.NONBREAKING_HYPHEN_UNICODE])}
                    </span></div>);
            }
            result = (<div><p>{localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-remarks-exist')}
            </p>
                <div className='padding-top-15 padding-bottom-15 promote-seed-info table'>
                    <div className='promote-seed-item table-row'>
                        {indents}
                    </div>
                </div>
                <p>{this.props.content}
                </p></div>);
        } else {
            result = (<p>{this.props.content}</p>);
        }
        return result;
    }
    /* tslint:disable:no-string-literal */

    /**
     * Get the directed remark locale key according to the directed remark request type.
     * @param {enums.RemarkRequestType} remarkRequestType
     * @returns remark request key
     */
    private getDirectedRemarkLocaleKey(remarkRequestType: enums.RemarkRequestType): string {
        return 'generic.remark-types.long-names.' + enums.RemarkRequestType[remarkRequestType];
    }
}

export = ConfirmationDialog;