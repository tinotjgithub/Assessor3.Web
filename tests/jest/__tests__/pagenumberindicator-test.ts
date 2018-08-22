jest.dontMock("../../../src/components/response/responsescreen/pagenumberindicator");
jest.dontMock("../../../src/actions/response/updatepagenumberindicatoraction");

import react = require("react");
import reactDom = require("react-dom");
import testUtils = require('react-dom/test-utils');
import PageNumberIndicator = require("../../../src/components/response/responsescreen/pagenumberindicator");
import dispatcher = require("../../../src/app/dispatcher");
import updatePageNumberIndicatorAction = require('../../../src/actions/response/updatepagenumberindicatoraction');

/**
* Test suite for page number indicator.
*/
describe("page number indicator tests", () => {

    let renderedOutput;

    beforeEach(() => {

        dispatcher.dispatch(new updatePageNumberIndicatorAction([1], [2]));
        var props = {
            noOfImages: 10
        };

        var pageNumberIndicatorComponent = react.createElement(PageNumberIndicator, props);
        renderedOutput = testUtils.renderIntoDocument(pageNumberIndicatorComponent);
    });

    it("checks if the page indicator component renderd ", () => {
        expect(renderedOutput).not.toBe(null);
    });

    it("checks if the page indicator component class renderd ", () => {
        var pageIndicatorDOMClass = testUtils.findRenderedDOMComponentWithClass(renderedOutput, 'page-number-marksheet');
        expect(pageIndicatorDOMClass).not.toBeNull();
    });

    it("checks if the total no of images is renderd correctly", () => {
        var pageIndicatorDOMClass = testUtils.findRenderedDOMComponentWithClass(renderedOutput, 'pn-max');
        expect(pageIndicatorDOMClass.textContent.trim()).toEqual('10');
    });
});