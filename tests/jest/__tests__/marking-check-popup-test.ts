import React = require('react');
import testUtils = require('react-dom/test-utils');
import MarkingCheckPopup = require('../../../src/components/worklist/markerinformation/markingcheckpopup');
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import markingCheckRecipientsFetchAction = require("../../../src/actions/markingcheck/markingcheckrecipientsfetchaction");

var localJson = require("../../../content/resources/rm-en.json");

describe("Marking Check Popup test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let data: Array<MarkingCheckRecipient>;

    data =
        [
            {
                examinerId: 23,
                isPE: false,
                surname: 'Alby',
                initials: 'R',
                fullname: 'Alby R',
                approvalStatus: 4,
                hasActiveMarkingCheck: false,
                isEligibleForMarkingCheck: true,
                isChecked: false
            },
            {
                examinerId: 24,
                isPE: false,
                surname: 'Benny',
                initials: 'M',
                fullname: 'Benny M',
                approvalStatus: 9,
                hasActiveMarkingCheck: true,
                isEligibleForMarkingCheck: false,
                isChecked: false
            },
        ]

    dispatcher.dispatch(new markingCheckRecipientsFetchAction(data, true));

    var markingCheckPopupComp = <MarkingCheckPopup />;

    var componentDOM = testUtils.renderIntoDocument(markingCheckPopupComp);

    it("checks if marking check popup component is rendered", () => {
        // to check component has been rendered
        
        expect(componentDOM).not.toBeNull();
    });

    it("checks if marking check popup component has marker list", () => {

        var result = testUtils.findRenderedDOMComponentWithClass(componentDOM, 'popup-content');
        expect(result).not.toBeNull();
    });

    it("checks if marking check popup component has OK button", () => {

        var result = testUtils.findRenderedDOMComponentWithClass(componentDOM, 'button primary rounded');
        expect(result).not.toBeNull();
    });

    it("checks if marking check popup component has Cancel button", () => {

        var result = testUtils.findRenderedDOMComponentWithClass(componentDOM, 'button rounded close-button');
        expect(result).not.toBeNull();
    });

});