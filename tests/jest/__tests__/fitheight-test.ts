jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/components/response/toolbar/zoompanel/fitheight");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import fitheight = require("../../../src/components/response/toolbar/zoompanel/fitheight");

describe("Fit Height Component Test", () => {
    /**Fit Height component rendering test **/
    let heightProps = {
        active: 'active'
    };

    let fitHeightComponent = react.createElement(fitheight, heightProps, null);
    let fitHeightComponentDOM = testUtils.renderIntoDocument(fitHeightComponent);

    /** To check if the Fit Height component has been loaded or not **/
    it("checks if the Fit Height component has been loaded", () => {
        expect(fitHeightComponentDOM).not.toBeNull();
    });

    /** To check if the Fit Height Button has been Loaded as Active or not **/
    it("checks if the Fit Height Button has been Loaded as Active or not", () => {
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(fitHeightComponentDOM, 'active');
        expect(scryReactElementFirstNode.className).toBe('active');

    });
});
