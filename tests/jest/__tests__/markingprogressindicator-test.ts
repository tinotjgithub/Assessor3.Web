jest.dontMock('../../../src/components/markschemestructure/markingprogressindicator')
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import MarkingProgressIndicator = require('../../../src/components/markschemestructure/markingprogressindicator');

describe('Checking whether the MarkingProgressIndicator component is rendering correctly', () => {

    it("check if the props assigned to the markschemeTotalMark works", () => {

        var renderResult;
        var markingProgressProps = { progressPercentage: 50, isVisible: true };
        var markingProgressComponent = React.createElement(MarkingProgressIndicator, markingProgressProps, null);
        renderResult = TestUtils.renderIntoDocument(markingProgressComponent);

        // Checking the marking percentage.
        var markingPercentage = TestUtils.findRenderedDOMComponentWithClass(renderResult, "inline-bubble pink");
        expect((markingPercentage.textContent)).toBe('50%');
    });
});