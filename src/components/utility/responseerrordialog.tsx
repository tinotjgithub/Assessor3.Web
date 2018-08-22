/*
  React component for combined warning messages popup
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('./enums');
import warning = require('../response/typings/warning');

interface Props extends PropsBase, LocaleSelectionBase {
    header: string;
    content: string;
    displayPopup: boolean;
    warningType: enums.WarningType;
    responseNavigateFailureReasons?: Array<warning>;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryButtonClick?: Function;
    onSecondaryButtonClick?: Function;
}

/**
 * React component class for Header for Authorized pages
 */
class ResponseErrorDialog extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);

        this.onPopupClick = this.onPopupClick.bind(this);
        this.onPopupNoClick = this.onPopupNoClick.bind(this);
    }

    /**
     * set all warning messages to show
     */
    private setAllWarningMessages() {
        let warningItems = null;
        if (this.props.responseNavigateFailureReasons && this.props.responseNavigateFailureReasons.length > 0) {
            warningItems = this.props.responseNavigateFailureReasons.map((warning: warning) => {
                return (
                    <li className='warning-item' id={warning.id} key={warning.id}>{warning.message}</li>
                );
            });
        }
        return warningItems;
    }

    /**
     *  set the footer of popup
     */
    private setPopupFooter() {
        if (this.props.warningType === enums.WarningType.PreventLeaveInGraceResponse) {
            return (
                <div className='popup-footer text-right' id='popupFooter'>
                    <button className='button primary rounded'
                        id='popupPrimaryButton'
                        title={this.props.primaryButtonText}
                        onClick={this.onPrimaryButtonClick}>
                        {this.props.primaryButtonText}
                    </button>
                </div>
            );
        } else if (this.props.warningType === enums.WarningType.LeaveResponse ||
            this.props.warningType === enums.WarningType.SubmitResponse) {
            return (
                <div className='popup-footer text-right' id='popupFooter'>
                    <button className='button rounded'
                        id='popupSecondaryButton'
                        title={this.props.secondaryButtonText}
                        onClick={this.onSecondaryButtonClick}>
                        {this.props.secondaryButtonText}</button>
                    <button className='button primary rounded'
                        id='popupPrimaryButton'
                        title={this.props.primaryButtonText}
                        onClick={this.onPrimaryButtonClick}>
                        {this.props.primaryButtonText}</button>
                </div>
            );
        }
    }

    /**
     * method on primary button click
     */
    private onPrimaryButtonClick = () => {
        this.props.onPrimaryButtonClick(this.props.warningType);
    };

    /**
     * method on secondary button click
     */
    private onSecondaryButtonClick = () => {
        this.props.onSecondaryButtonClick();
    };

    /**
     * Render method
     */
    public render() {
        if (this.props.displayPopup) {
            return (
                <div className='popup medium popup-overlay combined-warning-popup open'
                    id='combinedWarning'
                    role='dialog'
                    aria-labelledby='popup19Title'
                    aria-describedby='popup19Desc'
                    onClick={this.onPopupNoClick}>
                    <div className='popup-wrap' onClick={this.onPopupClick}>
                        <div className='popup-header'>
                            <h4 id='popup19Title'>{this.props.header}</h4>
                        </div>
                        <div className='popup-content' id='popup19Desc'>
                            <p className='login-nav-msg padding-bottom-10' id='popupContent'>{this.props.content}</p>
                            <ul className='combined-warnings' id='combinedWarnings'>
                                {this.setAllWarningMessages()}
                            </ul>
                        </div>
                        {this.setPopupFooter()}
                    </div>
                </div>
            );
        } else {
            return null;
        }
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
}

export = ResponseErrorDialog;