jest.dontMock("../../../src/components/exception/exceptionactionbutton")
import react = require("react");
import exceptionActionButton = require("../../../src/components/exception/exceptionactionbutton");
import shallowRenderer  = require('react-test-renderer/shallow');

describe("Exception Action Button Test", () => {
    /**Exception action button component rendering test **/
    let componentRender = new shallowRenderer();
    var props = {
        content: 'Escalate',
        className: 'sprite-icon round-arrow-up-icon',
        onActionException: Function
    }

    let exceptionActionButtonComponent = react.createElement(exceptionActionButton, props, null);
    let exceptionActionButtonComponentDOM = componentRender.render(exceptionActionButtonComponent);

    /** To check if the exception action button component has been loaded or not **/
    it("checks if the exception action button has been loaded", () => {
        expect(exceptionActionButtonComponentDOM).not.toBeNull();
    });
});