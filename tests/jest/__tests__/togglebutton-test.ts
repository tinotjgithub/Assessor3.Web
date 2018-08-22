jest.dontMock("../../../src/components/utility/togglebutton");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import ToggleButton = require("../../../src/components/utility/togglebutton");

describe('Toggle Button', () => {

    /* will check Toggle Button is rendered or not */
    it("checks if the Toggle Buttonis rendered", () => {

        var _style: React.CSSProperties = {};
        _style.color = 'rgba(0,0,255,1)';

        var props = { index: 1, isChecked: true, style: _style, title: 'ToggleButton title', onChange: jest.genMockFn().mockReturnThis() };
        var _toggleButtonComponent = TestUtils.renderIntoDocument(React.createElement(ToggleButton, props));
        expect(_toggleButtonComponent).not.toBe(null);
        var toggleButtonComponent = TestUtils.findRenderedDOMComponentWithClass(_toggleButtonComponent, "toggle-button");
        expect(toggleButtonComponent).not.toBe(null);
        expect(toggleButtonComponent).not.toBe(undefined);

    });

    it('checks if the title(when the button state is on) assigned to Toggle Button works as expected', function () {

        var _style: React.CSSProperties = {};
        _style.color = 'rgba(0,0,255,1)';
        var props = { index: 1, isChecked: true, style: _style, title: 'Click to hide current annotations', onChange: jest.genMockFn().mockReturnThis() };
        var _toggleButtonComponent = TestUtils.renderIntoDocument(React.createElement(ToggleButton, props));
        var toggleButtonComponent = TestUtils.findRenderedDOMComponentWithClass(_toggleButtonComponent, "toggle-button");
        expect(toggleButtonComponent.getAttribute('Title')).toBe('Click to hide current annotations');
    });

});