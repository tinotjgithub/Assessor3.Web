jest.dontMock("../../../src/components/markschemestructure/markbuttonscontainer");
import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import marksButtonContainer = require('../../../src/components/markschemestructure/markbuttonscontainer');
import maxButton = require('../../../src/components/markschemestructure/markbutton')

describe("Test suite for mark buttons container", () => {

    let maxButtonProps = {
        isVisible: true,
        onClick: Function,
        allocatedMark: { displayMark: '8', valueMark: '8' }
    }
    let maxButtonComponent = react.createElement(maxButton, maxButtonProps, null);
    let maxButtonDom = reactTestUtils.renderIntoDocument(maxButtonComponent);
    it("checks if maxbutton is rendered or not", () => {
        expect(maxButtonDom).not.toBeNull();

    });

});