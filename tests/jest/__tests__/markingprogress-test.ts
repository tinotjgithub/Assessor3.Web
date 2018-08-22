jest.dontMock("../../../src/components/worklist/shared/markingprogress");
import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import markingProgress = require("../../../src/components/worklist/shared/markingprogress");
import submitResponse = require("../../../src/components/worklist/shared/submitresponse");
import enums = require("../../../src/components/utility/enums");
import Immutable = require("immutable");

describe("Test suite for marking progress component", () => {

    it("checking if submit response button is rendered when exception is not raised and marking is completed", () => {
        var responseStatuses: Immutable.List<enums.ResponseStatus>;
        responseStatuses = Immutable.List<enums.ResponseStatus>();
        responseStatuses = responseStatuses.push(enums.ResponseStatus.readyToSubmit);
        let markingProgressProps = { selectedLanguage: "en-GB", progress: 100, responseStatus: responseStatuses }
        let markingProgressComponent = react.createElement(markingProgress, markingProgressProps, null);
        let markingProgressDom = reactTestUtils.renderIntoDocument(markingProgressComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(markingProgressDom, "button primary rounded").className;
        expect(result).toBe("button primary rounded submit-button");
    });

    it("checking if progress is rendered when exception is raised and marking is completed", () => {
        var responseStatuses: Immutable.List<enums.ResponseStatus>;
        responseStatuses = Immutable.List<enums.ResponseStatus>();
        responseStatuses = responseStatuses.push(enums.ResponseStatus.hasException);
        responseStatuses = responseStatuses.push(enums.ResponseStatus.markingInProgress);
        let markingProgressProps = { selectedLanguage: "en-GB", progress: 100, responseStatus: responseStatuses }
        let markingProgressComponent = react.createElement(markingProgress, markingProgressProps, null);
        let markingProgressDom = reactTestUtils.renderIntoDocument(markingProgressComponent);
        expect(reactDOM.findDOMNode(markingProgressDom).textContent).toBe(" 100%")
    });

    it("checking if marking is not started", () => {
        var responseStatuses: Immutable.List<enums.ResponseStatus>;
        responseStatuses = Immutable.List<enums.ResponseStatus>();
        responseStatuses = responseStatuses.push(enums.ResponseStatus.markingNotStarted);
        let markingProgressProps = { selectedLanguage: "en-GB", progress: 100, responseStatus: responseStatuses }
        let markingProgressComponent = react.createElement(markingProgress, markingProgressProps, null);
        let markingProgressDom = reactTestUtils.renderIntoDocument(markingProgressComponent);
        expect(reactTestUtils.scryRenderedDOMComponentsWithClass(markingProgressDom, "inline-bubble oval").length).toBe(0);
    });

    it("checking if nothing is rendered when progress is zero", () => {
        var responseStatuses: Immutable.List<enums.ResponseStatus>;
        responseStatuses = Immutable.List<enums.ResponseStatus>();
        responseStatuses = responseStatuses.push(enums.ResponseStatus.hasException);
        let markingProgressProps = { selectedLanguage: "en-GB", progress: 0, responseStatus: responseStatuses }
        let markingProgressComponent = react.createElement(markingProgress, markingProgressProps, null);
        let markingProgressDom = reactTestUtils.renderIntoDocument(markingProgressComponent);
        expect(reactDOM.findDOMNode(markingProgressDom).textContent).toBe(" ")
    });

    it("checking if progress is rendered", () => {
        var responseStatuses: Immutable.List<enums.ResponseStatus>;
        responseStatuses = Immutable.List<enums.ResponseStatus>();
        responseStatuses = responseStatuses.push(enums.ResponseStatus.markingInProgress);
        let markingProgressProps = { selectedLanguage: "en-GB", progress: 22, responseStatus: responseStatuses }
        let markingProgressComponent = react.createElement(markingProgress, markingProgressProps, null);
        let markingProgressDom = reactTestUtils.renderIntoDocument(markingProgressComponent);
        expect(reactDOM.findDOMNode(markingProgressDom).textContent).toBe(" 22%")
    });
});