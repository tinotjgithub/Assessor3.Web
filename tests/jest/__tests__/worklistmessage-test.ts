jest.dontMock("../../../src/components/worklist/shared/worklistmessage")
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import WorkListMessage = require("../../../src/components/worklist/shared/worklistmessage");

describe('WorkListMessage', () => {
    it("check if the props assigned to the worklist message works", () => {
        /**
         * Unit test for WorkListMessage, which shows No Responses Downloaded - work list empty
         */
        var workListMessageProps = { hasResponsesAvailableInPool: true, responseConcurrentLimit: 15};
        var workListMessageComponent = React.createElement(WorkListMessage, workListMessageProps, null);
        var renderworkListMessageComponent = TestUtils.renderIntoDocument(workListMessageComponent);
        var worklistMessageClass = TestUtils.findRenderedDOMComponentWithClass(renderworkListMessageComponent, "message-box dark-msg info-guide callout download-resp-msg").className;
        expect(worklistMessageClass).toBe("message-box dark-msg info-guide callout download-resp-msg");

        /**  Unit test for WorkListMessage, which shows Nothing to download - no responses in the pool */
        workListMessageProps = { hasResponsesAvailableInPool: false, responseConcurrentLimit: 15 };
        workListMessageComponent = React.createElement(WorkListMessage, workListMessageProps, null);
        renderworkListMessageComponent = TestUtils.renderIntoDocument(workListMessageComponent);
        worklistMessageClass = TestUtils.findRenderedDOMComponentWithClass(renderworkListMessageComponent, "message-box dark-msg info-guide download-resp-msg").className;
        expect(worklistMessageClass).toBe("message-box dark-msg info-guide download-resp-msg");
    }
});