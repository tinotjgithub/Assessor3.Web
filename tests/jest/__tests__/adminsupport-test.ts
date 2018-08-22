import enums = require("../../../src/components/utility/enums");
jest.dontMock("../../../src/components/adminsupport/adminsupport");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import AdminSupport = require("../../../src/components/adminsupport/adminsupport");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import loadContainerAction = require('../../../src/actions/navigation/loadcontaineraction');
import localeStore = require('../../../src/stores/locale/localestore');


describe("Test suite for admin support Component", function () {

    beforeEach(() => {
        dispatcher.dispatch(new loadContainerAction(enums.PageContainers.AdminSupport, false, enums.PageContainersType.None));
        dispatcher.dispatch(new localAction(true, "en-GB", localJson, null));
    });

    var adminSupportComponent;
    var componentDOM;

    it("checks if admin support component is rendered", () => {
        adminSupportComponent = React.createElement(AdminSupport, null);
        componentDOM = TestUtils.renderIntoDocument(adminSupportComponent);

        // to check component has been rendered
        expect(componentDOM).not.toBeNull();
    });

    it("checks if admin support header is rendered with proper text", () => {
        let content = TestUtils.findRenderedDOMComponentWithClass(componentDOM, "page-title-text");
        expect(content.textContent).toBe(localeStore.instance.TranslateText('support-login.support-login-page.page-title'));
    });

    it("checks if admin support blue helper message is rendered with proper text", () => {
        let content = TestUtils.findRenderedDOMComponentWithClass(componentDOM, "message-content");
        expect(content.textContent).toBe(localeStore.instance.TranslateText('support-login.support-login-page.content'));
    });

    it("checks if admin support component is rendered with login to live option with proper text", () => {
        let content = TestUtils.findRenderedDOMComponentWithClass(componentDOM, "login-options-holder");
        expect(content.textContent).toContain(localeStore.instance.TranslateText('support-login.support-login-page.radio-button-text-live'));
        expect(content.textContent).toContain(localeStore.instance.TranslateText('support-login.support-login-page.radio-button-text-support'));
    });
});