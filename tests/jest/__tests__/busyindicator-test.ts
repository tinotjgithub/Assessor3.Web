jest.dontMock("../../../src/components/utility/busyindicator/busyindicator");
jest.dontMock("../../../src/actions/locale/localeaction");

import React = require("react");
import busyIndicator = require("../../../src/components/utility/busyindicator/busyindicator");
import dispatcher = require("../../../src/app/dispatcher");
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");
import enums = require("../../../src/components/utility/enums");
import testUtils = require('react-dom/test-utils');
import reactDOM = require('react-dom');
import shallowRenderer = require('react-test-renderer/shallow');


/**
 * Describe test suite for the modal type busy indicator
 */
describe("Test suite for the busy indicator", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();

    it("will check whether busy indicator is shown when a response is submitted", () => {
        let busyIndicatorProps = { busyIndicatorInvoker: enums.BusyIndicatorInvoker.submit, isBusy: true };
        let busyIndicatorComponent = React.createElement(busyIndicator, busyIndicatorProps, null);
        let renderBusyIndicator = testUtils.renderIntoDocument(busyIndicatorComponent);
        expect(reactDOM.findDOMNode(renderBusyIndicator).textContent).toBe('Submitting response, please wait...');
    });

    it("will check whether busy indicator is shown when multiple responses are submitted", () => {
        let busyIndicatorProps = { busyIndicatorInvoker: enums.BusyIndicatorInvoker.submitAll, isBusy: true };
        let busyIndicatorComponent = React.createElement(busyIndicator, busyIndicatorProps, null);
        let renderBusyIndicator = testUtils.renderIntoDocument(busyIndicatorComponent);
        expect(reactDOM.findDOMNode(renderBusyIndicator).textContent).toBe('Submitting responses, please wait...');
    });

    it("will check whether busy indicator is not shown when invoker is set to none", () => {
        let busyIndicatorProps = { busyIndicatorInvoker: enums.BusyIndicatorInvoker.none, isBusy: false };
        let busyIndicatorComponent = React.createElement(busyIndicator, busyIndicatorProps, null);
        shallowRender.render(busyIndicatorComponent);
        let renderBusyIndicator = shallowRender.getRenderOutput();
        expect(renderBusyIndicator).toBeNull();
    });
});
