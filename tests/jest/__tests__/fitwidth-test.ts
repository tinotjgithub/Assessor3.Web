jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/components/response/toolbar/zoompanel/fitwidth");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import fitwidth = require("../../../src/components/response/toolbar/zoompanel/fitwidth");

describe("Fit Width Component Test", () => {
    /**Fit Width component rendering test **/
    let widthProps = {
        active: 'active'
    };

    let fitWidthComponent = react.createElement(fitwidth, widthProps, null);
    let fitWidthComponentDOM = testUtils.renderIntoDocument(fitWidthComponent);

    /** To check if the Fit Width component has been loaded or not **/
    it("checks if the Fitwidth component has been loaded", () => {
        expect(fitWidthComponentDOM).not.toBeNull();
    });

    /** To check if the Fit Width Button has been Loaded as Active or not **/
    it("checks if the Fit Width Button has been Loaded as Active or not", () => {
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(fitWidthComponentDOM, 'active');
        expect(scryReactElementFirstNode.className).toBe('active');

    });
});
