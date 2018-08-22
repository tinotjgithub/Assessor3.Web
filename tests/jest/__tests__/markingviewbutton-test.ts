jest.dontMock('../../../src/components/response/markingviewbutton')
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import MarkingViewButton = require('../../../src/components/response/markingviewbutton');
import enums = require('../../../src/components/utility/enums');
import dispatcher = require('../../../src/app/dispatcher');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');

describe('Checking whether the return to marking view button component is rendering correctly', () => {
     // open response
    dispatcher.dispatch(
        new responseOpenAction(
            true,
            6124700,
            enums.ResponseNavigation.specific,
            enums.ResponseMode.open,
            33099,
            enums.ResponseViewMode.zoneView,
            enums.TriggerPoint.None,
            null));

    it("check if the props assigned to the MarkingViewButton works", () => {

        let markingViewProps = { onMarkingViewButtonClick: null };
        let markingViewComponent = React.createElement(MarkingViewButton, markingViewProps, null);
        let renderMarkingViewComponent = TestUtils.renderIntoDocument(markingViewComponent);
        let markingViewClass = TestUtils.findRenderedDOMComponentWithClass(renderMarkingViewComponent, 'toggle-response-view').className;
        //Checking whether the expected css class is rendered.
        expect(markingViewClass).toBe('toggle-response-view');
    });
});