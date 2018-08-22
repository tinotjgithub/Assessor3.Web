jest.dontMock("../../../src/components/worklist/shared/submitresponse");
jest.dontMock("../../../src/actions/submit/submitresponsestartedaction");
import submitResponse = require("../../../src/components/worklist/shared/submitresponse");
import reactTestUtils = require('react-dom/test-utils');
import react = require("react");
import reactDOM = require('react-dom');
import submitActionCreator = require('../../../src/actions/submit/submitactioncreator');
import submitresponsestartedaction = require('../../../src/actions/submit/submitresponsestartedaction');
import enums = require('../../../src/components/utility/enums');

submitActionCreator.submitResponseStarted = jest.genMockFn();

describe("Test suite for share response component", () => {

    it("should check share button rendered by verifying class name", () => {
        let submitResponseProps = { selectedLanguage: "en-GB", markGroupId:221, isSubmitAll: false, standardisationSetupType: enums.StandardisationSetup.ProvisionalResponse }
        let submitResponseComponent = react.createElement(submitResponse, submitResponseProps, null);
        let submitResponseDom = reactTestUtils.renderIntoDocument(submitResponseComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(submitResponseDom, "button primary rounded").className;
        expect(result).toBe("primary button rounded popup-nav shareProv");
    });

});