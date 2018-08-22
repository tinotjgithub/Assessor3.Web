import enums = require("../../../src/components/utility/enums");
jest.dontMock("../../../src/components/reports/reportswrapper");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import ReportWrapper = require("../../../src/components/reports/reportswrapper");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import loadContainerAction = require('../../../src/actions/navigation/loadcontaineraction');

describe("Test suite for Report Wrapper Component", function () {

    beforeEach(() => {
        dispatcher.dispatch(new loadContainerAction(enums.PageContainers.Reports, false));
    });

    let reportsWrapperProps = {
        reportsDidMount: jest.genMockFn().mockReturnThis()
    };

    it("checks if report wrapper component is rendered", () => {

        // to check component has been rendered
        let reportsWrapperComponent = React.createElement(ReportWrapper, reportsWrapperProps);
        let componentDOM = TestUtils.renderIntoDocument(reportsWrapperComponent);
        expect(componentDOM).not.toBeNull();
    });
});