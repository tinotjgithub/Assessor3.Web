import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
var findDOMNode = require('react-dom').findDOMNode;
import enums = require("../../../src/components/utility/enums");
import MarkingCheckIndicator = require("../../../src/components/worklist/markingcheckindicator");
import markerOperationModeChangedAction = require("../../../src/actions/userinfo/markeroperationmodechangedaction");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");

describe("Test suite for Marking Check Indicator", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    it("checks if Marking Check Indicator component is rendered when markingcheckstatus is true and not in team management ", () => {

        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.Marking, true));
        var markingCheckStatus = <div><MarkingCheckIndicator isMarkingCheckAvailable={true} selectedLanguage= { "en-GB"} /></div>;
        var markingCheckStatusDOM = TestUtils.renderIntoDocument(markingCheckStatus);
        expect(findDOMNode(markingCheckStatusDOM).children[0]).not.toBeNull();
    });

    it("checks if Marking Check Indicator component is rendered  and showing correct text when markingcheckstatus is true and  in team management ", () => {

        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.Marking, true));
        var markingCheckStatus = <div><MarkingCheckIndicator isMarkingCheckAvailable={true} selectedLanguage= { "en-GB"} /></div>;
        var markingCheckStatusDOM = TestUtils.renderIntoDocument(markingCheckStatus);
        expect(findDOMNode(markingCheckStatusDOM).children[0].textContent).toBe('You have been asked to check the marks of one or more examiners. Select here to view and perform a marking check.');
    });

    it("checks if Marking Check Indicator component is rendered when markingcheckstatus is false and not in team management ", () => {

        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.Marking, true));
        var markingCheckStatus = <div><MarkingCheckIndicator isMarkingCheckAvailable={false} selectedLanguage= { "en-GB"} /></div>;
        var markingCheckStatusDOM = TestUtils.renderIntoDocument(markingCheckStatus);
        expect(findDOMNode(markingCheckStatusDOM).children[0]).toBeUndefined();
    });

    it("checks if Marking Check Indicator component is rendered when markingcheckstatus is false and  in team management ", () => {

        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.TeamManagement, true));
        var markingCheckStatus = <div><MarkingCheckIndicator isMarkingCheckAvailable={false} selectedLanguage= { "en-GB"} /></div>;
        var markingCheckStatusDOM = TestUtils.renderIntoDocument(markingCheckStatus);
        expect(findDOMNode(markingCheckStatusDOM).children[0]).toBeUndefined();
    });

    it("checks if Marking Check Indicator component is rendered when markingcheckstatus is true and  in team management ", () => {

        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.TeamManagement, true));
        var markingCheckStatus = <div><MarkingCheckIndicator isMarkingCheckAvailable={true} selectedLanguage= { "en-GB"} /></div>;
        var markingCheckStatusDOM = TestUtils.renderIntoDocument(markingCheckStatus);
        expect(findDOMNode(markingCheckStatusDOM).children[0]).toBeUndefined();
    });
}