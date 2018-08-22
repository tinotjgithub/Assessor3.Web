jest.dontMock("../../../src/components/worklist/shared/standardisationworklistmessage");
import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import Standardisationworklistmessage = require("../../../src/components/worklist/shared/standardisationworklistmessage");

/**
* Test suit for the standardisationworklistmessage
*/
describe("standardisationworklistmessage test", () => {
	/**standardisationworklistmessage component rendering test */
	it("checks if the component renderd ", () => {
		var standardisationworklistmessageComponent = <Standardisationworklistmessage selectedLanguage= { "en - GB"}/>;
		var standardisationworklistmessageComponentDOM = TestUtils.renderIntoDocument(standardisationworklistmessageComponent)
        expect(standardisationworklistmessageComponentDOM).not.toBeNull();

        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(standardisationworklistmessageComponentDOM, "message-box worklist-msgs").className;
        expect(responseIdClassName).toBe("message-box worklist-msgs wait-advise-msg");
	});
});