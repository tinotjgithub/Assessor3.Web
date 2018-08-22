/// <reference path="../../../typings/jest/jest.d.ts" />
/// <reference path="../../../src/components/user/useroptions/useroptions.tsx" />

jest.dontMock("../../../src/components/user/userdetails/userdetails");
import testUtils = require('react-dom/test-utils');
import react = require('react');
import UserDetails = require("../../../src/components/user/userdetails/userdetails");
import userInfo = require("../../../src/components/user/userinfo/userinfo");
import userOptions = require("../../../src/components/user/useroptions/useroptions");
import shallowRenderer  = require('react-test-renderer/shallow');

describe("Test suite for Userdetails component", () => {

    var shallowRender = new shallowRenderer();

    /** Mocking the render of child elements */
    userInfo.prototype.render = jest.genMockFn();
    userOptions.prototype.render = jest.genMockFn();

    var userDetailsProp = { selectedLanguage: "en-GB" };
    var userDetails = react.createElement(UserDetails, userDetailsProp, null);
    shallowRender.render(userDetails);


    it("will check whether User Details rendered", () => {
        var renderuserDetails = shallowRender.getRenderOutput();
        expect(renderuserDetails).not.toBeNull();
    });

    it("will check whether User Details has a particular class", () => {
        let renderuserDetails = testUtils.renderIntoDocument(userDetails);
        var result = testUtils.findRenderedDOMComponentWithClass(
            renderuserDetails, 'edit-settings-nav-holder');
        expect(result).toBeDefined();
    });
});