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

/**
 * React component class for Header for Authorized pages
 */
class ErrorDialogBase extends pureRenderComponent<any, any> {

    /**
     * Constructor ErrorDialog
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
        this.onViewMore = this.onViewMore.bind(this);
    }

    /**
     * Function for rendering the more information on error dialog
     */
    protected renderMoreInfo(): JSX.Element {
        /** if showing a custom error, no need to show more info part */
        if (!this.props.isCustomError) {
            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = this.props.viewMoreContent;
            let styleElement = htmlObject.getElementsByTagName('style')[0];
            if (styleElement) {
                styleElement.remove();
            }
            return (
                <div
                    className={classNames(
                        'panel',
                        {
                            'open': this.state.isViewMoreOpen === enums.Tristate.open,
                            'close': this.state.isViewMoreOpen === enums.Tristate.notSet ?
                                undefined : this.state.isViewMoreOpen === enums.Tristate.open ? false : true
                        }
                    )}
                >
                    <a href='javascript:void(0)'
                        onClick={this.onViewMore}
                        className='view-more panel-link'
                        title={localeStore.instance.TranslateText('generic.error-dialog.view-more')}>
                        {localeStore.instance.TranslateText('generic.error-dialog.view-more')}
                    </a>
                    <div className='error-detail panel-content grey-border-all padding-all-10' aria-hidden='true'
                        dangerouslySetInnerHTML={{ __html: htmlObject.innerHTML }}>
                    </div>
                </div>
            );
        }
    }

    /**
     * Render the OK button of error dialog
     */
    protected renderOKButton(): JSX.Element {
        return (
            <div className='popup-footer text-right'>
                <button onClick={this.onOkClick}
                    className='button primary rounded close-button'
                    title={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}>
                    {localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                </button>
            </div>
        );
    }

    /**
     * Render header of error dialog
     */
    protected renderErrorDialogHeader(): JSX.Element {
        return (
            <div className='popup-header iconic-header'>
                <span className={classNames({
                    'error-big-icon sprite-icon': this.props.showErrorIcon
                })} ></span>
                <h4 id='popup5Title' className='inline-block border-right: ;'>
                    {this.props.header ?
                        localeStore.instance.TranslateText(this.props.header) :
                        localeStore.instance.TranslateText('generic.error-dialog.header')}
                </h4>
            </div>
        );
    }


    /**
     * On Component Did Update
     */
    public componentDidUpdate() {
        if (this.props.isOpen) {
            keydownHelper.instance.DeActivate(enums.MarkEntryDeactivator.ApplicationPopup);
        } else {
            keydownHelper.instance.Activate(enums.MarkEntryDeactivator.ApplicationPopup);
        }
    }

    /**
     * On ok clicked
     * @param evnt
     */
    protected onOkClick(evnt: any) {
        this.props.onOkClick();
        this.setState({
            isViewMoreOpen: enums.Tristate.notSet
        });
    }

    /**
     * On view more clicked
     * @param evnt
     */
    protected onViewMore(evnt: any) {
        this.setState({
            isViewMoreOpen: this.state.isViewMoreOpen === enums.Tristate.open ?
                enums.Tristate.close : enums.Tristate.open
        });
    }
}

export = ErrorDialogBase;