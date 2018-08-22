jest.dontMock("../../../src/components/login/cookiepage");
jest.dontMock("../../../src/actions/locale/localeaction");

import React = require("react");
import CookiePage = require("../../../src/components/login/cookiepage");
import dispatcher = require("../../../src/app/dispatcher");
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");
import enums = require("../../../src/components/utility/enums");
import ReactTestUtils = require('react-dom/test-utils');
import reactDOM = require('react-dom');
import localeStore = require('../../../src/stores/locale/localestore');
import stringHelper = require('../../../src/utility/generic/stringhelper');
import shallowRenderer = require('react-test-renderer/shallow');
const COOKIE_KEY = 'language';
const SHOW_COOKIE_PAGE = 'showcookiepage';
const GA_COOKIE1 = '_ga';
const GA_COOKIE2 = '_gat';
const AUTH_COOKIE = 'AssessorAuthCookie';
const SESSION_IDENTIFIER_COOKIE = 'sessionidentifiercookie';

/**
 * Describe test suite for cookie page
 */
describe("Test suite for the Cookie page", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();

    var oncloseClick = jest.genMockFn();



    var cookiePageProps = { isCookieVisible: false, closeClick: oncloseClick };
    var cookieComponent = React.createElement(CookiePage, cookiePageProps, null);
    shallowRender.render(cookieComponent);
    var renderCookiePageWithIsCookieVisibleFalse = shallowRender.getRenderOutput();

    it("will check whether cookiepage is rendered=> It should not render", () => {
        expect(renderCookiePageWithIsCookieVisibleFalse).toBeNull();
    });

    cookiePageProps = { IsCookiesEnabled: true, isCookieVisible: true, closeClick: oncloseClick };
    cookieComponent = React.createElement(CookiePage, cookiePageProps, null);
    var renderCookiePage = ReactTestUtils.renderIntoDocument(cookieComponent);

    it("will check whether cookiepage is shown", () => {
        renderCookiePage.setState({ isShortMessage: true });
        jest.runAllTicks();

        var result = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, 'cookie-wrapper');
        expect(result).not.toBeNull();
    });

    it("will check whether cookiepage is shown and short msg is displayed", () => {
        renderCookiePage.setState({ isShortMessage: true });
        jest.runAllTicks();

        var result = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, 'cookie-wrapper');
        expect(result).not.toBeNull();

        result = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, 'short-msg');
        expect(result).not.toBeNull();
    });

    it("will check whether cookiepage is shown and short message is displayed successfully", () => {
        renderCookiePage.setState({ isShortMessage: true });
        jest.runAllTicks();

        let content = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, "cookies-msg");
        expect(content.textContent).toBe(stringHelper.format(localeStore.instance.TranslateText('login.cookie-panel.message-part-1'), [String(String.fromCharCode(179))]) + localeStore.instance.TranslateText('login.cookie-panel.cookies-link') + localeStore.instance.TranslateText('login.cookie-panel.message-part-2'));
    });

    it("will check whether cookiepage is shown and dont show message text is displayed successfully", () => {
        renderCookiePage.setState({ isShortMessage: true });
        jest.runAllTicks();

        let content = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, "cookies-msg-dont-show");
        expect(content.textContent).toBe(localeStore.instance.TranslateText('login.cookie-panel.dont-show-again'));
    });

    it("will check whether cookiepage is shown and close button text is displayed successfully", () => {
        renderCookiePage.setState({ isShortMessage: true });
        jest.runAllTicks();

        let content = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, "button rounded hide-cookie-msg light");
        expect(content.textContent).toBe(localeStore.instance.TranslateText('login.cookie-panel.close-button'));
    });

    it("will check whether cookie information page is rendered successfully", () => {
        renderCookiePage.setState({ isShortMessage: false });
        jest.runAllTicks();

        let result = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, "cookie-wrapper open");
        expect(result).not.toBeNull();

        result = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, "cookie-page exp-msg");
        expect(result).not.toBeNull();
    });

    it("will check whether cookie information page is rendered successfully with 'What are cookies' content ", () => {
        renderCookiePage.setState({ isShortMessage: false });
        jest.runAllTicks();

        let content = ReactTestUtils.findRenderedDOMComponentWithClass(renderCookiePage, "cookie-page exp-msg");

        expect(content.textContent).toBe(
            localeStore.instance.TranslateText('login.cookie-panel.close-button') +
            localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-header') +
            localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-part-1') +
            localeStore.instance.TranslateText('login.cookie-detail-page.what-are-cookies-part-2') +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-header') +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-part-1') +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookies-on-this-site-part-2') +
            localeStore.instance.TranslateText('login.cookie-detail-page.table-header-name') +
            localeStore.instance.TranslateText('login.cookie-detail-page.table-header-type') +
            localeStore.instance.TranslateText('login.cookie-detail-page.table-header-purpose') +
            COOKIE_KEY +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent') +
            localeStore.instance.TranslateText('login.cookie-detail-page.language-cookie-purpose') +
            SHOW_COOKIE_PAGE +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent') +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-page-cookie-purpose') +
            GA_COOKIE1 +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent') +
            localeStore.instance.TranslateText('login.cookie-detail-page.ga-cookie-purpose') +
            GA_COOKIE2 +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-persistent') +
            localeStore.instance.TranslateText('login.cookie-detail-page.gat-cookie-purpose') +
            AUTH_COOKIE +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-session') +
            localeStore.instance.TranslateText('login.cookie-detail-page.auth-cookie-purpose') +
            SESSION_IDENTIFIER_COOKIE +
            localeStore.instance.TranslateText('login.cookie-detail-page.cookie-type-session') +
            localeStore.instance.TranslateText('login.cookie-detail-page.session-id-cookie-purpose'));

    });

});
