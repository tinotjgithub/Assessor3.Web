jest.dontMock('../../../src/components/exception/exception');
jest.dontMock('../../../src/stores/marking/markingstore');
jest.dontMock('../../../src/stores/response/responsestore');

import react = require('react');
import testUtils = require('react-dom/test-utils');
import Exception = require('../../../src/components/exception/exception');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import enums = require('../../../src/components/utility/enums');
import dispatcher = require('../../../src/app/dispatcher');


describe("Exception panel test", () => {
    var exceptionDetails = {
    uniqueId: 12,
    exceptionType: 1,
    currentStatus: 1,
    dateTimeRaised: Date.now(),
    exceptionComments: [],
    markSchemeID: 0,
    examinerName: "",
    displayId: 12
    }

    var props = {
            closeExceptionPanel: false,
            isNewException: false,
            exceptionDetails: exceptionDetails,
            isExceptionPanelVisible: true
        }
    // open response
    dispatcher.dispatch(
        new responseOpenAction(
            true,
            124700,
            enums.ResponseNavigation.specific,
            enums.ResponseMode.open,
            33099,
            enums.ResponseViewMode.fullResponseView,
            enums.TriggerPoint.None,
            null));

    let exceptionComponent = react.createElement(Exception, props, null);
    let exceptionComponentDOM = testUtils.renderIntoDocument(exceptionComponent);


    /** To check if the Exception component has been loaded or not **/
    it("checks if the Exception panel component has been loaded", () => {
        expect(exceptionComponentDOM).not.toBeNull();
    });

    it("checks if the exception ID rendered correctly", () => {
        var exceptionclassName = testUtils.findRenderedDOMComponentWithClass(exceptionComponentDOM, 'exception-id').className;
        expect(exceptionclassName).toBe('exception-id');
        var exceptionId = testUtils.findRenderedDOMComponentWithClass(exceptionComponentDOM, 'exception-id').textContent;
        expect(exceptionId).toBe('512');
    });
});