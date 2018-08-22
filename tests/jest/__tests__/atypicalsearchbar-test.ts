import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require("../../../src/components/utility/enums");
import AtypicalSearchBar = require("../../../src/components/worklist/atypicalsearchbar");
import markerInformation = require("../../../src/stores/markerinformation/typings/markerinformation");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import markerInformationAction = require("../../../src/actions/markerinformation/markerinformationaction");

describe("Atypical Search bar test", function () {

    let atypicalSearchBarComponent;
    let atypicalSearchBarComponentDOM;
    let maxLengthValue: string = '128';
    let markerInfoData: markerInformation;
    
    let markerInfo = {
        "initials": "AA",
        "surname": "BB",
        "approvalStatus": 4,
        "markerRoleID": 90,
        "supervisorInitials": "CC",
        "supervisorSurname": "DD",
        "supervisorExaminerId": 10,
        "isSupervisorLoggedOut": false,
        "supervisorLogoutDiffInMinute": 10,
        "formattedSupervisorName": "EESS",
        "formattedExaminerName": "GGG",
        "supervisorLoginStatus": true
    };

    let markerInfo1 = {
        "initials": "AA",
        "surname": "BB",
        "approvalStatus": 9,
        "markerRoleID": 90,
        "supervisorInitials": "CC",
        "supervisorSurname": "DD",
        "supervisorExaminerId": 10,
        "isSupervisorLoggedOut": false,
        "supervisorLogoutDiffInMinute": 10,
        "formattedSupervisorName": "EESS",
        "formattedExaminerName": "GGG",
        "supervisorLoginStatus": true
    };

    
    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    markerInfoData = JSON.parse(JSON.stringify(markerInfo));
    dispatcher.dispatch(new markerInformationAction(true, markerInfoData));

    atypicalSearchBarComponent = React.createElement(AtypicalSearchBar, null, null);
    atypicalSearchBarComponentDOM = TestUtils.renderIntoDocument(atypicalSearchBarComponent);

    /** To check if the Atypical search bar component has been rendered or not **/
    it("checks if the Atypical search bar component has been rendered", () => {
        expect(atypicalSearchBarComponentDOM).not.toBeNull();
    });

    /** To check if the Center text box length is restricted or not **/
    it("checks if the Center place holder length is restricted or not", () => {
        var maxLength = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, 'search-input Center').getAttribute('maxLength');
        expect(maxLength).toBe(maxLengthValue);
    });

    /** To check if the Candidate text box length is restricted or not **/
    it("checks if the Candidate place holder length is restricted or not", () => {
        var maxLength = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, 'search-input Candidate').getAttribute('maxLength');
        expect(maxLength).toBe(maxLengthValue);
    });


    ////it("checks if Atypical search bar component is rendered when the examiner is in suspended status", () => {

    ////    //default value
    ////    var searchButtonClassName = "btn primary rounded disabled";
    ////    var searchButtonTittle = "You cannot get new responses until you have received feedback on your marking from your supervisor";
    ////    var centerClassName = "search-input Center";
    ////    var candidateClassName = "search-input Candidate";

    ////    markerInfoData = JSON.parse(JSON.stringify(markerInfo1));
    ////    dispatcher.dispatch(new markerInformationAction(true, markerInfoData));

    ////    atypicalSearchBarComponent = React.createElement(AtypicalSearchBar, null, null);
    ////    atypicalSearchBarComponentDOM = TestUtils.renderIntoDocument(atypicalSearchBarComponent);

    ////    // to check particular class name has been rendered
    ////    var atypicalSearchBarClassName = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, searchButtonClassName).className;
    ////    expect(atypicalSearchBarClassName).toBe(searchButtonClassName);

    ////    // to check particular title has been rendered
    ////    var accuracyIndicatorText = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, searchButtonClassName).getAttribute('title');
    ////    expect(accuracyIndicatorText).toBe(searchButtonTittle);

    ////    // to check particular class name has been rendered
    ////    var atypicalSearchBarClassName = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, centerClassName).className;
    ////    expect(atypicalSearchBarClassName).toBe(centerClassName);

    ////    // to check particular title has been rendered
    ////    var accuracyIndicatorText = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, centerClassName).getAttribute('title');
    ////    expect(accuracyIndicatorText).toBe(searchButtonTittle);

    ////    // to check particular class name has been rendered
    ////    var atypicalSearchBarClassName = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, candidateClassName).className;
    ////    expect(atypicalSearchBarClassName).toBe(candidateClassName);

    ////    // to check particular title has been rendered
    ////    var accuracyIndicatorText = TestUtils.findRenderedDOMComponentWithClass(atypicalSearchBarComponentDOM, candidateClassName).getAttribute('title');
    ////    expect(accuracyIndicatorText).toBe(searchButtonTittle);

    ////});
});
