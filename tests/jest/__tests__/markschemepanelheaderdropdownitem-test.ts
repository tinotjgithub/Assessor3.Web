import React = require("react");
import ReactDOM = require("react-dom");
import dispatcher = require("../../../src/app/dispatcher");
import TestUtils = require('react-dom/test-utils');
import MarkschemepanelHeaderDropdownitem = require("../../../src/components/markschemestructure/markschemepanelheaderdropdownitem");

describe("Test for markschemepanel dropdown item", () => {

    var _style: React.CSSProperties = {};
    _style.color = 'rgba(0,0,255,1)';

    it("check if the drop down item is rendered", () => {
        var props = { showCheckBox: true, label: 'Test Title', style: _style, isCheckboxSelected: true, isToggleButtonSelected: true, index: 0 };
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(MarkschemepanelHeaderDropdownitem, props));
        expect(renderedOutput).not.toBe(null);
        var component = TestUtils.findRenderedDOMComponentWithClass(renderedOutput, "remark-menu-item");
        expect(component).not.toBe(null);
        expect(component).not.toBe(undefined);
    });
});