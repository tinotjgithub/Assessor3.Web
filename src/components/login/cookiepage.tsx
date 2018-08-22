/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import PureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import cookieHelper = require('../../utility/cookie/cookiehelper');
import stringHelper = require('../../utility/generic/stringhelper');

const COOKIE_KEY = 'language';
const SHOW_COOKIE_PAGE = 'showcookiepage';
const GA_COOKIE1 = '_ga';
const GA_COOKIE2 = '_gat';
const SESSION_IDENTIFIER_COOKIE = 'sessionidentifiercookie';
declare let config: any;

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase , PropsBase {
    isCookieVisible: boolean;
    IsCookiesEnabled: boolean;
    closeClick: Function;
    setCookiePageVisibility: Function;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State extends LocaleSelectionBase {
    isShortMessage: boolean;
}

/**
 * React component class for CookiePage
 */
class CookiePage extends PureRenderComponent<Props, State> {

    /**
     * Constructor CookiePage
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Setting the initial state
        this.state = {
            isShortMessage: true
        };

        this.showCookiePage = this.showCookiePage.bind(this);
        this.dontShowClick = this.dontShowClick.bind(this);
        this.closeCookiePage = this.closeCookiePage.bind(this);
        this.closeCookiePopup = this.closeCookiePopup.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        let cookieText: string = this.props.IsCookiesEnabled ?
            localeStore.instance.TranslateText('login.cookie-panel.message-part-2') :
            localeStore.instance.TranslateText('login.cookie-panel.message-part-2-cookies-disabled');

        let cookieCheckBox: JSX.Element = this.props.IsCookiesEnabled ? (<div className='cookies-msg-dont-show'>
            <input type='checkbox'
                id = {this.props.id + '_dont_show_cookie_checkbox'}
                key = {this.props.id + '_dont_show_cookie_checkbox_key'}
                className='text-middle checkbox light'
                onClick={this.dontShowClick}>
            </input>
            <label htmlFor={this.props.id + '_dont_show_cookie_checkbox'} className='text-middle'>
                {localeStore.instance.TranslateText('login.cookie-panel.dont-show-again') }
            </label>
        </div>) : null;

        let cookieButton: JSX.Element = this.props.IsCookiesEnabled ? (<button className='button rounded hide-cookie-msg light'
                title={localeStore.instance.TranslateText('login.cookie-panel.close-button') }
                onClick={this.closeCookiePopup}>
                {localeStore.instance.TranslateText('login.cookie-panel.close-button') }
        </button>) : null;

        if (this.props.isCookieVisible) {
            let cookiePageTitle = stringHelper.format(
                localeStore.instance.TranslateText('login.cookie-panel.cookies-link-tooltip'),
                [String(String.fromCharCode(179))]);

            let cookieWrapperClass: string = this.state.isShortMessage ? 'cookie-wrapper' : 'cookie-wrapper open';
        return (
            <div className={classNames('panel', cookieWrapperClass)}>
                 <div className='short-msg'>
            	    <div className='wrapper'>
                        <p className='cookies-msg'>
                            {stringHelper.format(
                                localeStore.instance.TranslateText('login.cookie-panel.message-part-1'),
                                [String(String.fromCharCode(179))])}
                            <a href='javascript:void(0)'
                                title={cookiePageTitle}
                                className='show-cookie-page extra-light' onClick={this.showCookiePage}>
                                {localeStore.instance.TranslateText('login.cookie-panel.cookies-link')}
                            </a>
                            {cookieText}
                        </p>
                        {cookieCheckBox}
                        {cookieButton}
                    </div>
                </div>
           <div className='cookie-page exp-msg'>
            <a href='javascript:void(0)'
                className='close-cookie-page'
                onClick={this.closeCookiePage}
                title={localeStore.instance.TranslateText('login.cookie-panel.close-button')}>
                <span className='sprite-icon close-large-icon'>
                    {localeStore.instance.TranslateText('login.cookie-panel.close-button')}
                </span>
            </a>
            <div className='wrapper'>
            	<h2>{localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-header')}</h2>
            	<p>{localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-part-1')}</p>
                <p>{localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-part-2')}</p>
		        <h2>{localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-header')}</h2>
                <p>{localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-part-1')}</p>
                <p>{localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-part-2')}</p>
            <div>
            <table>
             <tbody>
                <tr>
                    <th>{localeStore.instance.TranslateText('login.cookie-detail-page.table-header-name')}</th>
                    <th>{localeStore.instance.TranslateText('login.cookie-detail-page.table-header-type')}</th>
                    <th>{localeStore.instance.TranslateText('login.cookie-detail-page.table-header-purpose')}</th>
                </tr>
                <tr>
                    <td>{COOKIE_KEY}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent')}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.language-cookie-purpose')}</td>
                </tr>
                <tr>
                    <td>{SHOW_COOKIE_PAGE}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent')}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-page-cookie-purpose')}</td>
                </tr>
                <tr>
                    <td>{GA_COOKIE1}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent') }</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.ga-cookie-purpose') }</td>
                </tr>
                <tr>
                    <td>{GA_COOKIE2}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent') }</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.gat-cookie-purpose') }</td>
                </tr>
                <tr>
                    <td>{config.general.ASSESSOR_AUTH_COOKIE_NAME}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-session') }</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.auth-cookie-purpose') }</td>
                </tr>
                <tr>
                    <td>{SESSION_IDENTIFIER_COOKIE}</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-session') }</td>
                    <td>{localeStore.instance.TranslateText('login.cookie-detail-page.session-id-cookie-purpose') }</td>
                </tr>

             </tbody>
            </table>
            </div>
            </div>
            </div>

        </div>
                );
            } else {
                return null;
            }
    }

    /**
     * cookie close button click
     * @param evt
     */
    private closeCookiePopup(evt: any): void {
     this.props.closeClick();
    }

    /**
     * cookie dont show tick
     * @param evt
     */
    private dontShowClick(evt: any): void {
        let expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        cookieHelper.saveToCookie(SHOW_COOKIE_PAGE, false, expireDate);
    }

    /**
     * show cookie page
     * @param evt
     */
    private showCookiePage(evt: any): void {
      this.setState({
            isShortMessage: false
        });
      // lets the loginpage know that cookiepage is open
      this.props.setCookiePageVisibility(true);
    }

    /**
     * close cookie page
     * @param evt
     */
    private closeCookiePage(evt: any): void {
      this.setState({
            isShortMessage: true
        });
      // lest the loginpage know that cookiepage is closed or minimised
      this.props.setCookiePageVisibility(false);
    }
}

export = CookiePage;


