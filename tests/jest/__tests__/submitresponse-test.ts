jest.dontMock("../../../src/components/worklist/shared/submitresponse");
jest.dontMock("../../../src/actions/submit/submitresponsestartedaction");
import submitResponse = require("../../../src/components/worklist/shared/submitresponse");
import reactTestUtils = require('react-dom/test-utils');
import react = require("react");
import reactDOM = require('react-dom');
import submitActionCreator = require('../../../src/actions/submit/submitactioncreator');
import submitStore = require('../../../src/stores/submit/submitstore');
import dispatcher = require("../../../src/app/dispatcher");
import submitresponsestartedaction = require('../../../src/actions/submit/submitresponsestartedaction');

submitActionCreator.submitResponseStarted = jest.genMockFn();

describe("Test suite for submit response component", () => {

    it("should check submit button rendered by verifying class name", () => {
        let submitResponseProps = { selectedLanguage: "en-GB", markGroupId:221, isSubmitAll: false }
        let submitResponseComponent = react.createElement(submitResponse, submitResponseProps, null);
        let submitResponseDom = reactTestUtils.renderIntoDocument(submitResponseComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(submitResponseDom, "button primary rounded").className;
        expect(result).toBe("button primary rounded submit-button");
    });

    it("should check submit all button rendered by verifying class name", () => {
        let submitResponseProps = { selectedLanguage: "en-GB", markGroupId: 221, isSubmitAll: true }
        let submitResponseComponent = react.createElement(submitResponse, submitResponseProps, null);
        let submitResponseDom = reactTestUtils.renderIntoDocument(submitResponseComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(submitResponseDom, "primary rounded").className;
        expect(result).toBe("button primary rounded");
    });

    it("Will call the mocked submit action creator method on submit all button click", () => {
        let submitResponseProps = { selectedLanguage: "en-GB", markGroupId: 221, isSubmitAll: true }
        let submitResponseComponent = react.createElement(submitResponse, submitResponseProps, null);
        let submitResponseDom = reactTestUtils.renderIntoDocument(submitResponseComponent);
        var submitButton = reactTestUtils.findRenderedDOMComponentWithClass(submitResponseDom, "primary rounded");
        /* mark group id will be zero for submit all */
        dispatcher.dispatch(new submitresponsestartedaction(0));
        reactTestUtils.Simulate.click(submitButton);
        expect(submitActionCreator.submitResponseStarted).toBeCalled();
        expect(submitStore.instance.getMarkGroupId).toBe(0);
    });

    it("Will call the mocked submit action creator method on submit single response button click", () => {
        let submitResponseProps = { selectedLanguage: "en-GB", markGroupId: 221, isSubmitAll: false }
        let submitResponseComponent = react.createElement(submitResponse, submitResponseProps, null);
        let submitResponseDom = reactTestUtils.renderIntoDocument(submitResponseComponent);
        var submitButton = reactTestUtils.findRenderedDOMComponentWithClass(submitResponseDom, "button primary rounded");
        dispatcher.dispatch(new submitresponsestartedaction(221));
        reactTestUtils.Simulate.click(submitButton);
        expect(submitActionCreator.submitResponseStarted).toBeCalled();
        /* mark group id will be set in the store for submit single response */
        expect(submitStore.instance.getMarkGroupId).toBe(221);
    });
});