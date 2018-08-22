jest.dontMock("../../../src/components/worklist/targetsummary/targets.tsx");
jest.dontMock("../../../src/components/utility/progressindicator/circularprogressindicator.tsx");

import React = require("react");
import ReactDOM = require("react-dom");
import ReactTestUtils = require('react-dom/test-utils');
import Targets = require("../../../src/components/worklist/targetsummary/targets");
import ProgressIndicator = require("../../../src/components/utility/progressindicator/circularprogressindicator");

describe("Test suite for Marking Target Progress Indicator", function () {

    var element;
    var dom;
    var pathProgressData;
    var progressIndicatorProps;

    beforeEach(() => {

        pathProgressData = new Array(
            { progress: 20, className: "target-progress-style1" },
            { progress: 30, className: "target-progress-style2" },
            { progress: 50, className: "target-progress-style" });

        progressIndicatorProps = { size: 104, startDegree: 0, endDegree: 360, trackWidth: 6, trackStyle: "target-track-style", progress: pathProgressData }
        element = React.createElement(ProgressIndicator, progressIndicatorProps, null);
        dom = ReactTestUtils.renderIntoDocument(element);

    });

    it("check progress indicator component is rendered or not", function () {
        expect(dom).not.toBeNull();
    });

    it("check all path progress are rendered or not", () => {
        var firstGraphIndicator = ReactTestUtils.findRenderedDOMComponentWithClass(dom, "target-progress-style");
        var secondGraphIndicator = ReactTestUtils.findRenderedDOMComponentWithClass(dom, "target-progress-style2");
        var thirdGraphIndicator = ReactTestUtils.findRenderedDOMComponentWithClass(dom, "target-progress-style1");
        expect(firstGraphIndicator).not.toBe(null);
        expect(secondGraphIndicator).not.toBe(null);
        expect(thirdGraphIndicator).not.toBe(null);
    });


});