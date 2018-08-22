import React = require("react");
import ReactDOM = require("react-dom");
import ReactTestUtils = require('react-dom/test-utils');
import loginForm = require("../../../src/components/login/loginform");
import userNameTxtBox = require("../../../src/components/login/loginusername");
import passwordBox = require("../../../src/components/login/loginpassword");
import header = require("../../../src/components/login/loginheader");
import slider = require("../../../src/components/login/loginslider");
import footer = require("../../../src/components/login/loginfooter");
import shallowRenderer  = require('react-test-renderer/shallow');

/**
 * Describe the test suite for login screen
 */
describe("Test suite for login screen", function () {
    var shallowRender = new shallowRenderer();

    var userNameTxtBoxProps = { id: "usernameBox", error: false, setValue: null, value: "", tabindex: 1 };
    var userNameElement = React.createElement(userNameTxtBox, userNameTxtBoxProps, null);

    var passwordBoxProps = { id: "passwordBox", error: false, setValue: null, value: "", tabindex: 2 };
    var passwordElement = React.createElement(passwordBox, passwordBoxProps, null);

    var loginHeaderProps = {};
    var headerElement = React.createElement(header, loginHeaderProps, null);

    var loginSliderProps = {};
    var sliderElement = React.createElement(slider, loginSliderProps, null);

    var footerProps = {};
    var footerElement = React.createElement(footer, footerProps, null);

    var props = {};
    var children = { headerElement, userNameElement, passwordElement, sliderElement, footerElement };

    
    var element = React.createElement(loginForm, props, children);
    shallowRender.render(element);
    var renderOutput = shallowRender.getRenderOutput();

    /*
     * Below is the positive test case.
     */
    it("will check whether Login UI rendered", () => {
        expect(renderOutput).not.toBeNull();
    });

    it("checks whether capslock on indicator is showing", () => {

        var password = ReactTestUtils.renderIntoDocument(passwordElement);
        password.setState({ hasCapsLockWarning: true });
        var result = ReactTestUtils.findRenderedDOMComponentWithClass(
            password, 'bubble-on');
        expect(result).not.toBeNull();
    });

    it("checks whether password contain validation errors", () => {

        var password = ReactTestUtils.renderIntoDocument(passwordElement);
        password.setState({ hasError: true });
        var result = ReactTestUtils.findRenderedDOMComponentWithClass(
            password, 'error');
        expect(result).toBeDefined();
    });

    it("checks whether username contain validation errors", () => {

        let userName = ReactTestUtils.renderIntoDocument(userNameElement);
        userName.setState({ hasError: true });
        let result = ReactTestUtils.findRenderedDOMComponentWithClass(
            userName, 'error');
        expect(result).toBeDefined();
    });

});
