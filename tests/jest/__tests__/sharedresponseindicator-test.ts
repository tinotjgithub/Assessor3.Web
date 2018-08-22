jest.dontMock("../../../src/components/standardisationsetup/shared/sharedresponseindicator")

import react = require("react");
import shallowRenderer = require('react-test-renderer/shallow');
import sharedResponseIndicatorIcon = require("../../../src/components/standardisationsetup/shared/sharedresponseindicator");
import TestUtils = require('react-dom/test-utils');

describe("shared response indicator  Component Test", () => {
    /**shared response indicator component rendering test **/
    var shallowRender = new shallowRenderer();
    var props = {
        isSharedProvisional: true
    }
    let sharedResponseIndicator = react.createElement(sharedResponseIndicatorIcon, props, null);
    let sharedResponseIndicatorComponentDOM = shallowRender.render(sharedResponseIndicator);

    /** To check if the shared response icon component has been loaded or not **/
    it("checks if the shared response indicator component has been loaded", () => {
        expect(sharedResponseIndicatorComponentDOM).not.toBeNull();
    });


    /** To check if the shared response icon component has been loaded with "sprite-icon share-icon" class**/
    it("will check whether the shared response icon is rendered with class sprite-icon share-icon", () => {

        props = { isSharedProvisional: true }
        sharedResponseIndicator = react.createElement(sharedResponseIndicatorIcon, props);
        var rendersharedResponseComponent = TestUtils.renderIntoDocument(sharedResponseIndicator);
        let rendersharedResponseComponentClass = TestUtils.scryRenderedDOMComponentsWithClass(rendersharedResponseComponent, 'sprite-icon share-icon');
        expect(rendersharedResponseComponentClass[0].className).toBe('sprite-icon share-icon');
    });
});
