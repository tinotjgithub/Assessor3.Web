jest.dontMock("../../../src/components/markschemestructure/markbutton");
import react = require("react");
import reactTestUtils = require('react-dom/test-utils');
import markButton = require('../../../src/components/markschemestructure/markbutton');


describe("Test suite for mark button", () => {

    it("checking if marksbutton is rendered", () => {

        let markButtonProps = {
            className: 'mark-button', allocatedMark: {
                displayMark: '8';
                valueMark: '8';
            } }
        let markButtonComponent = react.createElement(markButton, markButtonProps, null);
        let markButtonDom = reactTestUtils.renderIntoDocument(markButtonComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(markButtonDom, "mark-button");
        expect(result.className).toBe('mark-button');
        /* Check if mark is rendered */
        expect(result.textContent).toBe('8');
    });
});