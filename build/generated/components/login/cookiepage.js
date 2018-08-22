"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var PureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var cookieHelper = require('../../utility/cookie/cookiehelper');
var stringHelper = require('../../utility/generic/stringhelper');
var COOKIE_KEY = 'language';
var SHOW_COOKIE_PAGE = 'showcookiepage';
var GA_COOKIE1 = '_ga';
var GA_COOKIE2 = '_gat';
var SESSION_IDENTIFIER_COOKIE = 'sessionidentifiercookie';
/**
 * React component class for CookiePage
 */
var CookiePage = (function (_super) {
    __extends(CookiePage, _super);
    /**
     * Constructor CookiePage
     * @param props
     * @param state
     */
    function CookiePage(props, state) {
        _super.call(this, props, state);
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
    CookiePage.prototype.render = function () {
        var cookieText = this.props.IsCookiesEnabled ?
            localeStore.instance.TranslateText('login.cookie-panel.message-part-2') :
            localeStore.instance.TranslateText('login.cookie-panel.message-part-2-cookies-disabled');
        var cookieCheckBox = this.props.IsCookiesEnabled ? (React.createElement("div", {className: 'cookies-msg-dont-show'}, React.createElement("input", {type: 'checkbox', id: this.props.id + '_dont_show_cookie_checkbox', key: this.props.id + '_dont_show_cookie_checkbox_key', className: 'text-middle checkbox light', onClick: this.dontShowClick}), React.createElement("label", {htmlFor: this.props.id + '_dont_show_cookie_checkbox', className: 'text-middle'}, localeStore.instance.TranslateText('login.cookie-panel.dont-show-again')))) : null;
        var cookieButton = this.props.IsCookiesEnabled ? (React.createElement("button", {className: 'button rounded hide-cookie-msg light', title: localeStore.instance.TranslateText('login.cookie-panel.close-button'), onClick: this.closeCookiePopup}, localeStore.instance.TranslateText('login.cookie-panel.close-button'))) : null;
        if (this.props.isCookieVisible) {
            var cookiePageTitle = stringHelper.format(localeStore.instance.TranslateText('login.cookie-panel.cookies-link-tooltip'), [String(String.fromCharCode(179))]);
            var cookieWrapperClass = this.state.isShortMessage ? 'cookie-wrapper' : 'cookie-wrapper open';
            return (React.createElement("div", {className: classNames('panel', cookieWrapperClass)}, React.createElement("div", {className: 'short-msg'}, React.createElement("div", {className: 'wrapper'}, React.createElement("p", {className: 'cookies-msg'}, stringHelper.format(localeStore.instance.TranslateText('login.cookie-panel.message-part-1'), [String(String.fromCharCode(179))]), React.createElement("a", {href: 'javascript:void(0)', title: cookiePageTitle, className: 'show-cookie-page extra-light', onClick: this.showCookiePage}, localeStore.instance.TranslateText('login.cookie-panel.cookies-link')), cookieText), cookieCheckBox, cookieButton)), React.createElement("div", {className: 'cookie-page exp-msg'}, React.createElement("a", {href: 'javascript:void(0)', className: 'close-cookie-page', onClick: this.closeCookiePage, title: localeStore.instance.TranslateText('login.cookie-panel.close-button')}, React.createElement("span", {className: 'sprite-icon close-large-icon'}, localeStore.instance.TranslateText('login.cookie-panel.close-button'))), React.createElement("div", {className: 'wrapper'}, React.createElement("h2", null, localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-header')), React.createElement("p", null, localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-part-1')), React.createElement("p", null, localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-part-2')), React.createElement("h2", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-header')), React.createElement("p", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-part-1')), React.createElement("p", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-part-2')), React.createElement("div", null, React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", null, localeStore.instance.TranslateText('login.cookie-detail-page.table-header-name')), React.createElement("th", null, localeStore.instance.TranslateText('login.cookie-detail-page.table-header-type')), React.createElement("th", null, localeStore.instance.TranslateText('login.cookie-detail-page.table-header-purpose'))), React.createElement("tr", null, React.createElement("td", null, COOKIE_KEY), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent')), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.language-cookie-purpose'))), React.createElement("tr", null, React.createElement("td", null, SHOW_COOKIE_PAGE), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent')), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-page-cookie-purpose'))), React.createElement("tr", null, React.createElement("td", null, GA_COOKIE1), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent')), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.ga-cookie-purpose'))), React.createElement("tr", null, React.createElement("td", null, GA_COOKIE2), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent')), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.gat-cookie-purpose'))), React.createElement("tr", null, React.createElement("td", null, config.general.ASSESSOR_AUTH_COOKIE_NAME), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-session')), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.auth-cookie-purpose'))), React.createElement("tr", null, React.createElement("td", null, SESSION_IDENTIFIER_COOKIE), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-session')), React.createElement("td", null, localeStore.instance.TranslateText('login.cookie-detail-page.session-id-cookie-purpose'))))))))));
        }
        else {
            return null;
        }
    };
    /**
     * cookie close button click
     * @param evt
     */
    CookiePage.prototype.closeCookiePopup = function (evt) {
        this.props.closeClick();
    };
    /**
     * cookie dont show tick
     * @param evt
     */
    CookiePage.prototype.dontShowClick = function (evt) {
        var expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        cookieHelper.saveToCookie(SHOW_COOKIE_PAGE, false, expireDate);
    };
    /**
     * show cookie page
     * @param evt
     */
    CookiePage.prototype.showCookiePage = function (evt) {
        this.setState({
            isShortMessage: false
        });
        // lets the loginpage know that cookiepage is open
        this.props.setCookiePageVisibility(true);
    };
    /**
     * close cookie page
     * @param evt
     */
    CookiePage.prototype.closeCookiePage = function (evt) {
        this.setState({
            isShortMessage: true
        });
        // lest the loginpage know that cookiepage is closed or minimised
        this.props.setCookiePageVisibility(false);
    };
    return CookiePage;
}(PureRenderComponent));
module.exports = CookiePage;
//# sourceMappingURL=cookiepage.js.map