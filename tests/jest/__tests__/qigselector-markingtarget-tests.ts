jest.dontMock("../../../src/components/qigselector/markingtarget.tsx");
jest.dontMock("../../../src/components/utility/enums.ts");

import React = require("react");
import ReactDOM = require("react-dom");
import ReactTestUtils = require('react-dom/test-utils');
import MarkingTarget = require("../../../src/components/qigselector/markingtarget");
import enums = require("../../../src/components/utility/enums");

describe("Test suite for QIG selector marking target component", function () {

    let renderedOutput;

    beforeEach(() => {
        var markingTargetProps = {
            currentMarkingTarget: {
                markingMode: 1,
                markingCompletionDate: new Date(2016,2,25),
                maximumMarkingLimit: 40,
                remarkRequestType: 0,
                closedResponsesCount: 10,
                pendingResponsesCount: 10,
                openResponsesCount: 10,
                targetComplete: false,
                areResponsesAvailableToBeDownloaded: true,
                isActive: true,
                markingProgress: 10
            },
            qigValidationResult: {
                displayProgressBar: true,
                displayTarget: true,
                displayTargetDate: true,
                displayOpenResponseIndicator: false,
                displayResponseAvailableIndicator: true,
                statusColourClass: ""
            },
            examinerQIGStatus: enums.ExaminerQIGStatus.LiveMarking
        };

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);
    });

    it("Tests if the marking target component renders", function () {
        expect(renderedOutput).not.toBeNull();
    });

    it("Tests if the available response indicator renders", function () {
        var responseIndicatorDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon download-indicator-icon not-clickable");
        expect(responseIndicatorDOMElement).not.toBeNull();
    });

    it("Tests if the progress bar renders", function () {
        var progressBarDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-track");
        expect(progressBarDOMElement).not.toBeNull();
    });

    it("Tests if the progress displays expected value for open responses", function () {
        var progressBarOpenDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress progress1 open");
        expect(progressBarOpenDOMElement.getAttribute('style')).toContain('75%');
    });

    it("Tests if the progress displays expected value for grace period responses", function () {
        var progressBarInGraceDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress progress2 ingrace");
        expect(progressBarInGraceDOMElement.getAttribute('style')).toContain('50%');
    });

    it("Tests if the progress displays expected value for closed responses", function () {
        var progressBarClosedDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress progress3 closed");
        expect(progressBarClosedDOMElement.getAttribute('style')).toContain('25%');
    });

    it("Tests if the submitted count renders", function () {
        var submittedDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "submitted-holder small-text middle-content-right");
        expect(submittedDOMElement).not.toBeNull();
    });

    it("Tests if the submitted count is displaying expected value", function () {
        var submittedDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "submitted-holder small-text middle-content-right");
        expect(submittedDOMElement.textContent.trim()).toEqual("20/40");
    });

    it("Tests if the open response indicator renders", function () {

        // Stage data to display open response indicator.
        var markingTargetProps = {
            currentMarkingTarget: {
                markingMode: 1,
                markingCompletionDate: new Date(2016, 2, 25),
                maximumMarkingLimit: 20,
                remarkRequestType: 0,
                closedResponsesCount: 10,
                pendingResponsesCount: 10,
                openResponsesCount: 10,
                targetComplete: false,
                areResponsesAvailableToBeDownloaded: true,
                isActive: true,
                markingProgress: 10
            },
            qigValidationResult: {
                displayProgressBar: true,
                displayTarget: true,
                displayTargetDate: true,
                displayOpenResponseIndicator: true,
                displayResponseAvailableIndicator: false,
                statusColourClass: ""
            },
            examinerQIGStatus: enums.ExaminerQIGStatus.LiveMarking
        };

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);

        var openIndicatorDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon downloaded-indicator-icon not-clickable");
        expect(openIndicatorDOMElement).not.toBeNull();
    });

    it("Test whether the text is 'No Live Marking Quota' If the examiner is not having target.", function () {
        // Stage data to display open response indicator.
        var markingTargetProps = {
            qigValidationResult: {
                displayProgressBar: false,
                displayTarget: false,
                displayTargetDate: false,
                displayOpenResponseIndicator: false,
                displayResponseAvailableIndicator: false,
                statusColourClass: "error",
                statusText: "No Live Marking Quota"
            }
        };

        var markingTargetComponent = React.createElement(MarkingTarget, markingTargetProps);
        renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);
        var targetNameDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-title middle-content-left align-middle error");
        expect(targetNameDOMElement).not.toBeNull();
        expect(targetNameDOMElement.textContent.trim()).toEqual("No Live Marking Quota");
    });
});