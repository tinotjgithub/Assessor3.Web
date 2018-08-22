/// <reference path="../../../typings/jest/jest.d.ts" />

jest.dontMock("../../../src/components/utility/notification/messagenotificationindicator");
jest.dontMock("../../../src/components/utility/notification/exceptionnotificationindicator");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import MessageNotificationIndicator = require("../../../src/components/utility/notification/messagenotificationindicator");
import ExceptionNotificationIndicator = require("../../../src/components/utility/notification/exceptionnotificationindicator");

describe('NotificationIndicator', () => {

    it("checks if the props assigned to message notification indicator works", () => {
        var messageNotificationIndicator = <MessageNotificationIndicator messageNotificationCount = {5} />;
        var messageNotificationDOM = TestUtils.renderIntoDocument(messageNotificationIndicator);
        var renderedComponent = TestUtils.scryRenderedComponentsWithType(messageNotificationDOM, MessageNotificationIndicator)[0];
        expect(renderedComponent.props.messageNotificationCount).toBe(5);

        messageNotificationIndicator = <MessageNotificationIndicator messageNotificationCount = {0} />;
        messageNotificationDOM = TestUtils.renderIntoDocument(messageNotificationIndicator);
        renderedComponent = TestUtils.scryRenderedComponentsWithType(messageNotificationDOM, MessageNotificationIndicator)[0];
        expect(renderedComponent.props.messageNotificationCount).toBe(0);
    });


    it("checks if the props assigned to exception notification indicator works", () => {
        var exceptionNotificationIndicator = <ExceptionNotificationIndicator exceptionNotificationCount = {5} />;
        var exceptionNotificationDOM = TestUtils.renderIntoDocument(exceptionNotificationIndicator);
        var renderedComponent = TestUtils.scryRenderedComponentsWithType(exceptionNotificationDOM, ExceptionNotificationIndicator)[0];
        expect(renderedComponent.props.exceptionNotificationCount).toBe(5);

        exceptionNotificationIndicator = <ExceptionNotificationIndicator exceptionNotificationCount = {0} />;
        exceptionNotificationDOM = TestUtils.renderIntoDocument(exceptionNotificationIndicator);
        renderedComponent = TestUtils.scryRenderedComponentsWithType(exceptionNotificationDOM, ExceptionNotificationIndicator)[0];
        expect(renderedComponent.props.exceptionNotificationCount).toBe(0);
    });
});

