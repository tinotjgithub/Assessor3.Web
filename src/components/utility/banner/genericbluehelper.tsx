import React = require('react');
import ReactDom = require('react-dom');
import bannerBase = require('./bannerbase');
import enums = require('../enums');
let classNames = require('classnames');


/** 
 * Helper message component for blue banner with close button
 */
class GenericBlueHelper extends bannerBase {

    /** 
     * on click on the close button
     */
    private onCloseClick = () => {
        if (this.props.bannerType === enums.BannerType.HelperMessageWithClose) {
            this.props.onCloseClick();
        }
        this.setState({
            isVisible: false
        });
    };

    /**
     * Render method
     */
    public render(): JSX.Element {
        let toRender = (this.props.message !== null && this.props.message !== '') ?
            <div
                className={this.classNameToApply}
                id={this.props.id}
                key={this.props.id}
                role={this.props.role}
                aria-hidden={this.props.isAriaHidden}>
                <a
                    id={this.props.id + 'Close'}
                    key={this.props.id + 'Close'}
                    href='javascript:void(0)'
                    onClick={this.onCloseClick}
                    className='close'
                    title='close'>
                    <span className='close-icon' />
                </a>
                <p className='message-body'>{this.props.message}</p>
            </div> : null;
        return toRender;
    }

    /**
     * Returns the class name to apply for the blue helper.
     */
    private get classNameToApply(): string {
        let classNameToApply: string = '';
        if (this.props.bannerType === enums.BannerType.CompleteStdSetupBanner) {
            classNameToApply = 'message-box dark-msg float-msg left callout left-bottom complete-setup';
        } else if (this.props.bannerType === enums.BannerType.HelperMessageWithClose) {
            classNameToApply = 'message-box help-message dark-msg float-msg top right callout ';
        }
        classNameToApply = classNames(classNameToApply, { show: this.state.isVisible }, { hide: !this.state.isVisible });
        return classNameToApply;
    }

    /** 
     * Component will receive props
     */
    public componentWillReceiveProps(nextProps: any) {
        if (this.props.isVisible !== nextProps.isVisible) {
            this.setState({
                isVisible: nextProps.isVisible
            });
        }
    }
}

export = GenericBlueHelper;