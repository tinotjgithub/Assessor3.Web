jest.dontMock("../../../src/components/worklist/shared/linkedexceptionindicator");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import LinkedExceptionIndicator = require("../../../src/components/worklist/shared/linkedexceptionindicator");

describe('LinkedExceptionIndicator', () => {

      /**
         * Unit test for checking if the props assigned to the Linked Exception Indicator works
         * with blocked exception and resolved exception count
         */

    it("check if the props assigned to the Linked Exception Indicator works with blocked exception and resolved exception count", () => {
        let linkedExceptionProps = { hasBlockingExceptions: true, resolvedExceptionsCount: 5, hasExceptions:true };
        let linkedExceptionComponent = React.createElement(LinkedExceptionIndicator, linkedExceptionProps, null);
        let renderLinkedExceptionComponent = TestUtils.renderIntoDocument(linkedExceptionComponent);
        let linkedExceptionClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedExceptionComponent, "sprite-icon info-icon-yellow").className;
        expect(linkedExceptionClass).toBe("sprite-icon info-icon-yellow");
        linkedExceptionClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedExceptionComponent, "notification circle").className;
        expect(linkedExceptionClass).toBe("notification circle");
    });

      /**
         * Unit test for Linked exception indicator, checking whether the props assigned to the
         * Linked exception indicator works with unblocked exception and resolved exception count
         */

    it("Tests whether the props assigned to the Linked Exception Indicator works with unblocked exception and resolved exception count ", () => {
        let linkedExceptionProps = { hasBlockingExceptions: false, resolvedExceptionsCount: 5, hasExceptions: true };
       let linkedExceptionComponent = React.createElement(LinkedExceptionIndicator, linkedExceptionProps, null);
       let renderLinkedExceptionComponent = TestUtils.renderIntoDocument(linkedExceptionComponent);
       let linkedExceptionClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedExceptionComponent, "sprite-icon info-icon-dark-small").className;
       expect(linkedExceptionClass).toBe("sprite-icon info-icon-dark-small");
       linkedExceptionClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedExceptionComponent, "notification circle").className;
       expect(linkedExceptionClass).toBe("notification circle");
    });

      /**
         * Unit test for Linked exception indicator, testing whether the props assigned to the
         * Linked exception indicator works with blocked exception
         */

    it("Tests whether the props assigned to the Linked Exception Indicator works with blocked exception", () => {
        let linkedExceptionProps = { hasBlockingExceptions: true, hasExceptions: true, resolvedExceptionsCount: 0 };
        let linkedExceptionComponent = React.createElement(LinkedExceptionIndicator, linkedExceptionProps, null);
        let renderLinkedExceptionComponent = TestUtils.renderIntoDocument(linkedExceptionComponent);
        let linkedExceptionClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedExceptionComponent, "sprite-icon info-icon-yellow").className;
        expect(linkedExceptionClass).toBe("sprite-icon info-icon-yellow");
        expect(TestUtils.scryRenderedDOMComponentsWithClass(renderLinkedExceptionComponent, "notification circle").length).toBe(0);
    });

      /**
         * Unit test for Linked exception indicator, checking whether the props assigned to the
         * Linked exception indicator works with unblocked exception
         */

    it("Tests whether the props assigned to the Linked Exception Indicator works with unblocked exception", () => {
        let linkedExceptionProps = { hasBlockingExceptions: false, resolvedExceptionsCount: 0, hasExceptions: true };
        let linkedExceptionComponent = React.createElement(LinkedExceptionIndicator, linkedExceptionProps, null);
        let renderLinkedExceptionComponent = TestUtils.renderIntoDocument(linkedExceptionComponent);
        let linkedExceptionClass = TestUtils.findRenderedDOMComponentWithClass(renderLinkedExceptionComponent, "sprite-icon info-icon-dark-small").className;
        expect(linkedExceptionClass).toBe("sprite-icon info-icon-dark-small");
        expect(TestUtils.scryRenderedDOMComponentsWithClass(renderLinkedExceptionComponent, "notification circle").length).toBe(0);
    });

     /**
         * Unit test for Linked exception indicator, checking whether the props assigned to the
         * Linked exception indicator works without exception
         */

    it("Tests whether the props assigned to the Linked Exception Indicator works with no exception", () => {
        let linkedExceptionProps = { hasBlockingExceptions: true, resolvedExceptionsCount: 0, hasExceptions: false };
        let linkedExceptionComponent = React.createElement(LinkedExceptionIndicator, linkedExceptionProps, null);
        let renderLinkedExceptionComponent = TestUtils.renderIntoDocument(linkedExceptionComponent);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(renderLinkedExceptionComponent, "sprite-icon info-icon-yellow").length).toBe(0);
    });

     /**
         * Unit test for Linked exception indicator, checking whether the props assigned to the
         * Linked exception indicator works with without exception
         */

    it("Tests whether the props assigned to the Linked Exception Indicator works with no exception", () => {
        let linkedExceptionProps = { hasBlockingExceptions: false, resolvedExceptionsCount: 0, hasExceptions: false };
        let linkedExceptionComponent = React.createElement(LinkedExceptionIndicator, linkedExceptionProps, null);
        let renderLinkedExceptionComponent = TestUtils.renderIntoDocument(linkedExceptionComponent);
        expect(TestUtils.scryRenderedDOMComponentsWithClass(renderLinkedExceptionComponent, "sprite-icon info-icon-dark-small").length).toBe(0);
    });

    });