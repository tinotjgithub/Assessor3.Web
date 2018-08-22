jest.dontMock("../../../src/components/worklist/shared/gridtogglebutton");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import GridToggleButton = require("../../../src/components/worklist/shared/gridtogglebutton");
import enums = require('../../../src/components/utility/enums');

describe('Grid Toggle Button', () => {

    /* will check Toggle Button works as expected with class detail view  */
    it("checks if the prop assigned to Toggle Button works as expected with class list view", () => {
        var props = { toggleGridView: null, isSelected: true, buttonType: enums.GridType.detailed };
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridToggleButton, props));
        expect(renderedOutput).not.toBe(null);
        var toggleButtonStyle = TestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon grid-view-icon");
        expect(toggleButtonStyle).not.toBe(null);
        expect(toggleButtonStyle).not.toBe(undefined);
    });

    /* will check Toggle Button works as expected with class tile view  */
    it("checks if the prop assigned to Toggle Button works as expected with class tile view", () => {
        var props = { toggleGridView: null, isSelected: true, buttonType: enums.GridType.tiled  };
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridToggleButton, props));
        expect(renderedOutput).not.toBe(null);
        var toggleButtonStyle = TestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon tile-view-icon");
        expect(toggleButtonStyle).not.toBe(null);
        expect(toggleButtonStyle).not.toBe(undefined);
    });

    var onToggleButtonClick = jest.genMockFn();
    /* will check Toggle Button click with  class detail view */
    it("checks if the prop assigned to Toggle Button works as expected with class detail view active", () => {
        var props = { selectedLanguage: "en-GB", id: "1", key: "sds", toggleGridView: onToggleButtonClick, isSelected: false, buttonType: enums.GridType.detailed };
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridToggleButton, props));
        var switchView = TestUtils.findRenderedDOMComponentWithClass(renderedOutput, "switch-view");
        expect(switchView).not.toBe(null);
        TestUtils.Simulate.click(switchView);
        expect(onToggleButtonClick).toBeCalled();
    });

    /* will check Toggle Button click with  class tile view */
    it("checks if the prop assigned to Toggle Button works as expected with class tile view", () => {
        var props = { selectedLanguage: "en-GB", id: "1", key: "sds", toggleGridView: onToggleButtonClick, isSelected: true, buttonType: enums.GridType.tiled };
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridToggleButton, props));
        var switchView = TestUtils.findRenderedDOMComponentWithClass(renderedOutput, "switch-view");
        expect(switchView).not.toBe(null);
        TestUtils.Simulate.click(switchView);
        expect(onToggleButtonClick).toBeCalled();
    });

});

