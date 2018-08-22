jest.dontMock("../../../src/components/worklist/shared/linkedmessageindicator");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import LinkedMessageIndicator = require("../../../src/components/worklist/shared/linkedmessageindicator");

describe('LinkedMessageIndicator', () => {

    it("check if the props assigned to the LinkedMessageIndicator works with message count", () => {
        /**
         * Unit test for Linked message component, testing whether the message is rendering properly
         */
        let linkedMessageProps = { messageCount: 5, hasMessages:true };
        let linkedMessageComponent = React.createElement(LinkedMessageIndicator, linkedMessageProps, null);
        let renderLinkedMessageComponent = TestUtils.renderIntoDocument(linkedMessageComponent);
        let linkedMessageClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedMessageComponent, "message-icon sprite-icon").className;
        expect(linkedMessageClass).toBe("message-icon sprite-icon");
        linkedMessageClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedMessageComponent, "notification circle").className;
        expect(linkedMessageClass).toBe("notification circle");
    });

    it("check if the props assigned to the LinkedMessageIndicator works with no message count", () => {
        /**   Unit test for Linked message component, testing whether the message is rendering properly */
        let linkedMessageProps = { messageCount: 0, hasMessage:true }
        let linkedMessageComponent = React.createElement(LinkedMessageIndicator, linkedMessageProps, null);
        let renderLinkedMessageComponent = TestUtils.renderIntoDocument(linkedMessageComponent);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(renderLinkedMessageComponent, "notification circle").length).toBe(0);
    });

    it("check if the props assigned to the LinkedMessageIndicator works", () => {
        /**   Unit test for Linked message component, testing whether the message is rendering properly */
        let linkedMessageProps = { messageCount: 0, hasMessage: false}
        let linkedMessageComponent = React.createElement(LinkedMessageIndicator, linkedMessageProps, null);
        let renderLinkedMessageComponent = TestUtils.renderIntoDocument(linkedMessageComponent);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(renderLinkedMessageComponent, "message-icon sprite-icon").length).toBe(0);
    });

});
