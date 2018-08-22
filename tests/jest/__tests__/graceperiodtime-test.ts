jest.dontMock("../../../src/components/worklist/shared/graceperiodtime");
import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import Graceperiodtime = require("../../../src/components/worklist/shared/graceperiodtime");

/**
* Test suit for the graceperiodtime
*/
describe("graceperiodtime test", () => {
	/** grace period time component rendering test */
	it("checks if the component renderd ", () => {
        var graceperiodtimeComponent = <Graceperiodtime selectedLanguage= { "en - GB"} timeToEndOfGracePeriod= {10} />;
        var graceperiodtimeComponentDOM = TestUtils.renderIntoDocument(graceperiodtimeComponent);
        expect(graceperiodtimeComponentDOM).not.toBeNull();

        var result = TestUtils.findRenderedDOMComponentWithClass(graceperiodtimeComponentDOM, "small-text").className;
        expect(result).toBe("small-text");
	});
});