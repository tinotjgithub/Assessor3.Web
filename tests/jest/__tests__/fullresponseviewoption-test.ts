/// <reference path="../../../src/components/response/fullresponseviewoption.tsx" />
jest.dontMock('../../../src/components/response/fullresponseviewoption')
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import FullResponseViewOption = require('../../../src/components/response/fullresponseviewoption');

describe('Checking whether the Full response view option is rendering correctly', () => {

    it("check if the props assigned to the Full response view option works", () => {
        var renderResult;
        var onResponseOptionClick = jest.genMockFn();
        var onChangePageViewClick = jest.genMockFn();

        var fullResponseOptionProps = { isActive: true, changeViewIconClass: 'sprite-icon page-1-icon', onChangeViewClick: onResponseOptionClick};
        var fullResponseOptionComponent = TestUtils.renderIntoDocument(React.createElement(FullResponseViewOption, fullResponseOptionProps));
        expect(fullResponseOptionComponent).not.toBe(null);

        /** Testing with sprite-icon page-1-icon class */
        renderResult = TestUtils.scryRenderedDOMComponentsWithClass(fullResponseOptionComponent, 'sprite-icon page-1-icon');
        expect(renderResult.length).toBe(1);

        /** Testing with active class */
        renderResult = TestUtils.scryRenderedDOMComponentsWithClass(fullResponseOptionComponent, 'active');
        expect(renderResult.length).toBe(1);

        /** Simulating the click on Viewer*/
        var ChangeViewButton = TestUtils.findRenderedDOMComponentWithClass(fullResponseOptionComponent, "page-view-link");
        TestUtils.Simulate.click(ChangeViewButton);

        expect(onResponseOptionClick).toBeCalled();
    });


});