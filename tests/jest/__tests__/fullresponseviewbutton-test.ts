jest.dontMock('../../../src/components/response/fullresponseviewbutton')
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import FullResponseViewButton = require('../../../src/components/response/fullresponseviewbutton');

describe('Checking whether the FullResponse button component is rendering correctly', () => {

    it("check if the props assigned to the MarkingViewButton works", () => {

        let fullResponseViewProps = { onFullResponseClick: null };
        let fullResponseViewButtonComponent = React.createElement(FullResponseViewButton, fullResponseViewProps, null);
        let renderfullResponseViewComponent = TestUtils.renderIntoDocument(fullResponseViewButtonComponent);
        let fullResponseViewClass = TestUtils.findRenderedDOMComponentWithClass(renderfullResponseViewComponent, 'mrk-change-view').className;
        //Checking whether the expected css class is rendered.
        expect(fullResponseViewClass).toBe('mrk-change-view');
    });
});