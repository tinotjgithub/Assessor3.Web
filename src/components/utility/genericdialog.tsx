/*
  React component for Generic dialog popup
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('./enums');
import moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
import modulekeys = require('../../utility/generic/modulekeys');
import keyDownHelper = require('../../utility/generic/keydownhelper');

interface Props extends PropsBase, LocaleSelectionBase {
    header: string;
    content: string;
    secondaryContent?: string;
    multiLineContent?: Array<string>;
    displayPopup: boolean;
    onOkClick: Function;
    okButtonText: string;
    popupDialogType: enums.PopupDialogType;
    listOfContents?: string[];
    footerContent?: string;
}

/**
 * React component class for Header for Authorized pages
 */
class GenericDialog extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);

        this.onOkClick = this.onOkClick.bind(this);
        this.onPopupClick = this.onPopupClick.bind(this);
    }

    /**
     * Render method
     */
    public render() {

        if (this.props.displayPopup) {
            let outerDivClassName = null;
            let content = null;
            let header = (<div className='popup-header'>
                <h4 id={'popup_' + this.props.id + '_header'}>{this.props.header}</h4>
            </div>);
            let buttonElement: JSX.Element = (<button className='primary button rounded close-button'
                                onClick={ this.onOkClick}
                                autoFocus={true}
                                title={this.props.okButtonText}
                                id={'popup_' + this.props.id + '_ok_button'}>{this.props.okButtonText}</button>);

            if (this.props.popupDialogType) {
                // Attaching key handlers.
                this.attachKeyHandler();
            }

            switch (this.props.popupDialogType) {
                case enums.PopupDialogType.none:
                case enums.PopupDialogType.StandardisationApproved:
                case enums.PopupDialogType.GracePeriodWarning:
                case enums.PopupDialogType.GenericMessage:
                    outerDivClassName = 'popup medium popup-overlay std-approved open';
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                            <br/>
                            <p>{this.props.secondaryContent}</p>
                        </div>);
                    break;
                case enums.PopupDialogType.ResponseAllocationError:
                case enums.PopupDialogType.EmailSave:
                case enums.PopupDialogType.ManageSLAO:
                    outerDivClassName = 'popup small popup-overlay close-button popup-open open';
                    content = (<div className='popup-content' id={'popup_' + this.props.id + '_description'}><p>
                        {this.props.content}</p></div>);
                    break;
                case enums.PopupDialogType.AllPageNotAnnotated:
                case enums.PopupDialogType.MarkEntryValidation:
                case enums.PopupDialogType.RemarkCreated:
                case enums.PopupDialogType.PromoteToSeedDeclined:
                case enums.PopupDialogType.SubmitResponseError:
                    outerDivClassName = 'popup small popup-overlay close-button popup-open open';
                    content = (<div className='popup-content' id={'popup_' + this.props.id + '_description'}><p>
                        {this.props.content}</p></div>);
                    break;
                case enums.PopupDialogType.NonRecoverableDetailedError:
                    outerDivClassName = 'popup small popup-overlay close-button error-popup open';
                    header = (<div className='popup-header iconic-header'>
                        <span className='error-big-icon sprite-icon'></span>
                        <h4 id={'popup_' + this.props.id + '_header'} className='inline-block'>{this.props.header}</h4>
                    </div>);
                    let multiLineItems = null;
                    if (this.props.multiLineContent && this.props.multiLineContent.length > 0) {
                        multiLineItems = this.props.multiLineContent.map((rowItem: string) => {
                            return (
                                <li>{rowItem}</li>
                            );
                        });
                    }
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                            <ul className='bolder'>{multiLineItems}</ul>
                        </div>);
                    break;
                case enums.PopupDialogType.QualityFeedbackWarning:
                    outerDivClassName = 'popup small popup-overlay quality-feedback open';
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                        </div>);
                    break;
                case enums.PopupDialogType.OffLineWarning:
                    outerDivClassName = 'popup small popup-overlay close-button error-popup open';
                    header = (<div className='popup-header iconic-header'>
                        <span className='error-big-icon sprite-icon'></span>
                        <h4 id={'popup_' + this.props.id + '_header'} className='inline-block'>{this.props.header}</h4>
                    </div>);
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                        </div>);
                    break;
                case enums.PopupDialogType.OffLineWarningOnContainerFailure:
                    outerDivClassName = 'popup small popup-overlay close-button error-popup open';
                    header = (<div className='popup-header iconic-header'>
                        <span className='error-big-icon sprite-icon'></span>
                        <h4 id={'popup_' + this.props.id + '_header'} className='inline-block'>{this.props.header}</h4>
                    </div>);
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                        </div>);
                    buttonElement = null;
                    break;
                case enums.PopupDialogType.ResponseAlreadyReviewed:
                    outerDivClassName = 'popup medium popup-overlay open';
                    header = (<div className='popup-header'>
                        <h4 id={'popup_' + this.props.id + '_header'} className='inline-block border-right'>
                            {this.props.header}</h4>
                    </div>);
                    content = (<div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                        <p>{this.props.content}</p>
                    </div>);
                    break;
                case enums.PopupDialogType.RemoveLinkError:
                    content = (<div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                        <p>{this.props.content}</p>
                        <br/>
                        {this.getContentOfList() }
                    </div>);
                    outerDivClassName = 'popup medium popup-overlay open';
                    header = (<div className='popup-header'>
                        <h4 id={'popup_' + this.props.id + '_header'} className='inline-block border-right'>
                            {this.props.header}</h4>
                    </div>);
                    break;
                case enums.PopupDialogType.SimulationExited:
                    outerDivClassName = 'popup medium popup-overlay move-simulation-popup fixed-hf open';
                    header = (<div className='popup-header'>
                        <h4 id={'popup_' + this.props.id + '_Title'} >
                            {this.props.header}</h4>
                    </div>);
                    content = (<div className='popup-content' id={'popup_' + this.props.id + '_Desc'}>
                        <p className='login-nav-msg padding-bottom-10'>
                            {this.props.secondaryContent}
                        </p>
                        <div className='qig-moved-wrapper'>
                            {this.getSimulationExitedQigsContent()}
                        </div>
                        <p className='padding-top-10'>{this.props.footerContent}</p>
                    </div>);
                    break;
                case enums.PopupDialogType.ReclassifyError:
                    outerDivClassName = 'popup medium popup-overlay open';
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                        </div>);
                    break;
                case enums.PopupDialogType.DiscardResponse:
                    outerDivClassName = 'popup medium popup-overlay open';
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                        </div>);
                    break;
                case enums.PopupDialogType.ConcurrentSaveFail:
                    outerDivClassName = 'popup small popup-overlay open';
                    content = (
                        <div className='popup-content' id={'popup_' + this.props.id + '_description'}>
                            <p>{this.props.content}</p>
                        </div>);
                    break;
            }

            return (
                <div className= {outerDivClassName}
                    id={'popup_' + this.props.id}
                    role='dialog'
                    aria-labelledby={'popup_' + this.props.id + '_header'}
                    aria-describedby={'popup_' + this.props.id + '_description'}
                    onClick={this.onPopupClick}>
                    <div className='popup-wrap' onClick={this.onPopupClick}>
                        { header }
                        { content }
                        <div className='popup-footer text-right'>
                            {buttonElement}
                        </div>
                    </div>
                </div>);
        } else {

            return null;
        }
    }

    /**
     * return the list as content for the popup
     */
    private getContentOfList() {
        if (this.props.listOfContents) {
            let content = this.props.listOfContents.map((item: string) => {
                return (<p>{item}</p>);
            });
            return content;
        } else {
            return null;
        }
    }

    /**
     * Invoking the onOkClick call back event
     * @param evnt
     */
    private onOkClick(evnt: any) {
        if (this.props.onOkClick) {

            if (this.props.popupDialogType === enums.PopupDialogType.MarkEntryValidation ||
                this.props.popupDialogType === enums.PopupDialogType.GracePeriodWarning ||
                this.props.popupDialogType === enums.PopupDialogType.RemarkCreated ||
                this.props.popupDialogType === enums.PopupDialogType.PromoteToSeedDeclined ||
                this.props.popupDialogType === enums.PopupDialogType.GenericMessage ||
                this.props.popupDialogType === enums.PopupDialogType.ManageSLAO ||
                this.props.popupDialogType === enums.PopupDialogType.ResponseAllocationError ||
                this.props.popupDialogType === enums.PopupDialogType.OffLineWarning) {
                // Unmount the event to give others the priority
                keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

                // Unmount the event to give others the priority
                keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
            }
            this.props.onOkClick();
        }
    }

    /**
     * On clicking on the popup dialog
     * @param evnt
     */
    private onPopupClick(evnt: any) {
        evnt.stopPropagation();
        return false;
    }

    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    private keyHandler(event: KeyboardEvent): boolean {

        let key = event.keyCode || event.charCode;
        if (key === enums.KeyCode.enter) {
            this.onOkClick(event);
        } else if (key === enums.KeyCode.backspace) {

            keyDownHelper.KeydownHelper.stopEvent(event);
            return true;
        }

        return true;
    }

    /**
     * Attaching key handlers.
     */
    private attachKeyHandler() {
        let keyDownHandler: moduleKeyHandler;
        let keyPressHandler: moduleKeyHandler;

        keyDownHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_DOWN, enums.Priority.Second, true,
            this.keyHandler.bind(this), enums.KeyMode.down);
        keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);

        keyPressHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_PRESS, enums.Priority.Second, true,
            this.keyHandler.bind(this), enums.KeyMode.press);
        keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
    }

    /**
     * Get contents of simulation exited qigs
     */
    private getSimulationExitedQigsContent() {
        if (this.props.content === null) {
            let qigNames: Array<string> = new Array<string>();
            qigNames = this.props.multiLineContent;
            let toRender = qigNames.map((_qig: string, index: number) => {
                return (
                    <div className='qig-moved' key={'qig-moved-' + index.toString()}>
                        {_qig}
                    </div>);
            });
            return toRender;
        } else {
            return (
                <div className='qig-moved'>
                    {this.props.content}
                </div>);
        }
    }
}


export = GenericDialog;