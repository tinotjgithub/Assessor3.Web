jest.dontMock("../../../src/components/response/toolbar/messageicon/messageicon")

import react = require("react");
import testUtils = require('react-dom/test-utils');
import messageIcon = require("../../../src/components/response/toolbar/messageicon/messageicon")


describe("Zoom panel Component Test", () => {
    /**MessageIcon component rendering test **/

    let messageIconComponent = react.createElement(messageIcon);
    let messageIconComponentDOM = testUtils.renderIntoDocument(messageIconComponent);

    /** To check if the MessageIcon component has been loaded or not **/
    it("checks if the zoompanel component has been loaded", () => {
        expect(messageIconComponentDOM).not.toBeNull();
    });

    

});