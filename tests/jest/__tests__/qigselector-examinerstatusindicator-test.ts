jest.dontMock("../../../src/components/qigselector/markingtarget.tsx");
jest.dontMock("../../../src/components/utility/enums.ts");

import React = require("react");
import ReactDOM = require("react-dom");
import ReactTestUtils = require('react-dom/test-utils');
import MarkingTarget = require("../../../src/components/qigselector/markingtarget");
import enums = require("../../../src/components/utility/enums");


describe("Test suite for QIG selector examiner status indicator", function () {

    it("check marking target rendered", function () {

        var markingTargetProps = {
            currentMarkingTarget: {},
            qigValidationResult: {},
            examinerQIGStatus: ""
        };

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);

        expect(renderedOutput).not.toBeNull();
    });

    it("check status color for warning rendered", function () {

        // Stage props to set the status as warning.
        var markingTargetProps = {
            currentMarkingTarget: {},
            qigValidationResult: {
                statusColourClass: "warning"
			},
            examinerQIGStatus: ""
		};

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);

        var warningDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-title middle-content-left align-middle warning");
        expect(warningDOMElement).not.toBeNull();
    });

    it("check status color for error rendered", function () {

        // Stage props to set the status as warning.
        var markingTargetProps = {
            currentMarkingTarget: {},
            qigValidationResult: {
                statusColourClass: "error"
            },
            examinerQIGStatus: ""
        };

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);

        var errorDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-title middle-content-left align-middle error");
        expect(errorDOMElement).not.toBeNull();
    });

    it("check status color for black rendered", function () {

        // Stage props to set the status as warning.
        var markingTargetProps = {
            currentMarkingTarget: {},
            qigValidationResult: {
                statusColourClass: ""
            },
            examinerQIGStatus: ""
        };

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);

        var blackDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-title");
        expect(blackDOMElement).not.toBeNull();
    });
});