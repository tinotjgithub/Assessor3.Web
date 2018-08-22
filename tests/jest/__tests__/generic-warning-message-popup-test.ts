import React = require('react');
import TestUtils = require('react-dom/test-utils');
import WarningMessagePopup = require("../../../src/components/teammanagement/warningmessagepopup");
import dispatcher = require("../../../src/app/dispatcher");
import ReactDOM = require('react-dom');
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");
import validationaction = require('../../../src/actions/teammanagement/validationaction');
import enums = require('../../../src/components/utility/enums');

describe("Warning message popup test", () => {

    /** Warning message popup component rendering test **/

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var warningMessagePopup = <WarningMessagePopup id = {'id_warning_message_popup'}
    key = { 'key__warning_message_popup'} buttonText = { 'OK'} />;

    var componentDOM = TestUtils.renderIntoDocument(warningMessagePopup);
    dispatcher.dispatch(new validationaction(enums.FailureCode.HierarchyChanged,
        enums.WarningMessageAction.SupervisorSampling));

    it("checks if warning message popup is rendered", () => {
        // to checks if warning message popup is rendered
        expect(componentDOM).not.toBeNull();
    });

    it("will check whether the header is displaying properly for warning message dialog", () => {
        // to check whether the header is displaying properly for warning message dialog
        let popupHeader = TestUtils.findRenderedDOMComponentWithClass(componentDOM, "popup-header");
        expect(popupHeader.textContent).toBe("Examiner hierarchy changed");
    });

    it("will check whether the content is displaying properly for warning message dialog", () => {
        // to check whether the content is displaying properly for warning message dialog
        let popupContent = TestUtils.findRenderedDOMComponentWithClass(componentDOM, "popup-content");
        expect(popupContent.textContent).toBe("Your role has changed and you are no longer allowed to perform this action.");
    });

    it("will check whether the ok button text is displaying properly for warning message dialog", () => {
        // to check whether the ok button text is displaying properly for warning message dialog
        let buttonElement = TestUtils.findRenderedDOMComponentWithClass(componentDOM, "primary button rounded close-button");
        expect(buttonElement.textContent).toBe("OK");
    });

});
