jest.dontMock("../../../src/components/response/toolbar/exceptionicon/exceptionicon")

import react = require("react");
import shallowRenderer = require('react-test-renderer/shallow');
import exceptionIcon = require("../../../src/components/response/toolbar/exceptionicon/exceptionicon");


describe("Exception icon Component Test", () => {
    /**Exception Icon component rendering test **/
    var shallowRender = new shallowRenderer();
    var props = {
            onExceptionSelected: Function,
            onCreateNewExceptionClicked: Function,
            canRaiseException: true
        }
    let exceptionIconComponent = react.createElement(exceptionIcon,props,null);
    let exceptionIconComponentDOM = shallowRender.render(exceptionIconComponent);

    /** To check if the exception icon component has been loaded or not **/
    it("checks if the exception component has been loaded", () => {
        expect(exceptionIconComponentDOM).not.toBeNull();
    });



});