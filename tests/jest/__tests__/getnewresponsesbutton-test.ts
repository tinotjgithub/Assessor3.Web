jest.dontMock("../../../src/components/worklist/shared/allocateresponsebutton")
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import GetNewResponsesButton = require("../../../src/components/worklist/shared/allocateresponsebutton");
describe('GetNewResponses', () => {
    it("check if the props assigned to the getNewResponses works", () => {
        /**
         * Test for getNewResponses button enabled status
         */
        var getNewResponsesProps = { isEnabled: true};
        var getNewResponsesComponent = React.createElement(GetNewResponsesButton, getNewResponsesProps, null);
        var rendergetNewResponsesComponent = TestUtils.renderIntoDocument(getNewResponsesComponent);
        var getNewResponsesWithClass = TestUtils.findRenderedDOMComponentWithClass(rendergetNewResponsesComponent,
                                                    "primary rounded large download-rsp-btn split-btn").className
        expect(getNewResponsesWithClass).toBe("primary rounded large download-rsp-btn split-btn");
     
        /**
         * Test for getNewResponses button disabled status    
         */
        getNewResponsesProps = { isEnabled: false };
        getNewResponsesComponent = React.createElement(GetNewResponsesButton, getNewResponsesProps, null);
        rendergetNewResponsesComponent = TestUtils.renderIntoDocument(getNewResponsesComponent);
        getNewResponsesWithClass = TestUtils.findRenderedDOMComponentWithClass(rendergetNewResponsesComponent,
                                                                                "primary rounded large download-rsp-btn split-btn disabled").className;
     
        expect(getNewResponsesWithClass).toBe("primary rounded large download-rsp-btn split-btn disabled")

    }
});