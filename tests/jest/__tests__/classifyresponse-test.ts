jest.dontMock('../../../src/components/standardisationsetup/shared/classifyresponse');
import React = require("react");
import ClassifyResponseActionButton = require("../../../src/components/standardisationsetup/shared/classifyresponse");
import shallowRenderer = require('react-test-renderer/shallow');
import testUtils = require('react-dom/test-utils');

describe("Classify Response Action Button Test", () => {
    let componentRender = new shallowRenderer();
    let props = {
        isDisabled: true,
        renderedOn: 1,
        esMarkGroupId: 101,
        buttonTextResourceKey: '',
        onClickAction: Function
    }

    let classifyResponseActionButtonComponent = React.createElement(ClassifyResponseActionButton, props, null);
    let classifyResponseActionButtonComponentDOM = componentRender.render(classifyResponseActionButtonComponent);

    it("checks if the classify response action button has been loaded", () => {
        expect(classifyResponseActionButtonComponentDOM).not.toBeNull();
    });
});