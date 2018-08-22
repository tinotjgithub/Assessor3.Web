jest.dontMock("../../../src/components/worklist/markerinformation/personalinformation");
jest.dontMock("../../../src/components/worklist/markerinformation/supervisorinformation");
jest.dontMock("../../../src/components/worklist/markerinformation/markerinformationpanel");

import React = require("react");
import ReactTestUtils = require('react-dom/test-utils');
import PersonalInformation = require("../../../src/components/worklist/markerinformation/personalinformation");
import SupervisorInformation = require("../../../src/components/worklist/markerinformation/supervisorinformation");
import MarkerInformationPanel = require("../../../src/components/worklist/markerinformation/markerinformationpanel");

describe("Test suite for supervisor information ui component", () => {

    let renderedSupervisorComponent;

    afterEach(() => {
        renderedSupervisorComponent = undefined;
    });

    it("Tests whether the supervisor information component loads correctly", () => {
        renderSupervisorComponent('Rajagopal', false, 3);
        expect(renderedSupervisorComponent).not.toBeNull();
    });

    it("Tests whether the supervisor name is loading as expected", () => {
        renderSupervisorComponent('Rajagopal', false, 3);
        var nameDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedSupervisorComponent, "user-name large-text");
        expect(nameDOMElement.textContent).toEqual("Rajagopal");
    });

    it("Tests whether supervisor online status is showing", () => {
        renderSupervisorComponent('Rajagopal', true, 0);
        var nameDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedSupervisorComponent, "online-status small-text");
        expect(nameDOMElement.textContent).not.toBeNull();

        var className = ReactTestUtils.findRenderedDOMComponentWithClass(renderedSupervisorComponent, "online-status-bubble").className;
        expect(className).toEqual('online-status-bubble online');
    });

    it("Tests whether supervisor offline status is showing correctly", () => {
        renderSupervisorComponent('Rajagopal', false, -1);
        var className = ReactTestUtils.findRenderedDOMComponentWithClass(renderedSupervisorComponent, "online-status-bubble").className;
        expect(className).toEqual('online-status-bubble');
    });

    function renderSupervisorComponent(supervisorName, isSupervisorOnline, supervisorOfflineHours) {
        var supervisorComponentProps = { selectedLanguage: "en-GB", supervisorName: supervisorName, isSupervisorOnline: isSupervisorOnline, supervisorOfflineHours: supervisorOfflineHours  };
        var supervisorComponent = React.createElement(SupervisorInformation, supervisorComponentProps);
        renderedSupervisorComponent = ReactTestUtils.renderIntoDocument(supervisorComponent);
    }
});

describe("Test suite for personal information ui component", () => {

    it("Tests whether the personal information component loads correctly", () => {
        var personalComponentProps = { examinerName: "kumar", examinerRole: 1, approvalStatus: 4 };
        var personalComponent = React.createElement(PersonalInformation, personalComponentProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(personalComponent);
        expect(renderedOutput).not.toBeNull();
    });

    it("Tests whether the logged in user's name is loading loads as expected", () => {
        var personalComponentProps = { examinerName: "kumar", examinerRole: 1, approvalStatus: 4 };
        var personalComponent = React.createElement(PersonalInformation, personalComponentProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(personalComponent);
        var nameDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "user-name large-text");
        expect(nameDOMElement.textContent).toEqual("kumar");
    });

    it("Tests whether the approval status class for approved user is loaded as expected", () => {
        var personalComponentProps = { examinerName: "kumar", examinerRole: 1, approvalStatus: 4 };
        var personalComponent = React.createElement(PersonalInformation, personalComponentProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(personalComponent);

        // Try to retrieve the DOM element with the "success" class set.
        var statusClass = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon success-small-icon");
        expect(statusClass).not.toBeNull();
    });

    it("Tests whether the approval status class for suspended user is loaded as expected", () => {
        var personalComponentProps = { examinerName: "kumar", examinerRole: 1, approvalStatus: 9 };
        var personalComponent = React.createElement(PersonalInformation, personalComponentProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(personalComponent);

        // Try to retrieve the DOM element with the "error" class set.
        var statusClass = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon error-small-icon");
        expect(statusClass).not.toBeNull();
    });

    it("Tests whether the approval status class for conditionally approved user is loaded as expected", () => {
        var personalComponentProps = { examinerName: "kumar", examinerRole: 1, approvalStatus: 10 };
        var personalComponent = React.createElement(PersonalInformation, personalComponentProps);
        var renderedOutput = ReactTestUtils.renderIntoDocument(personalComponent);

        // Try to retrieve the DOM element with the "warning" class set.
        var statusClass = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon warning-small-icon");
        expect(statusClass).not.toBeNull();
    });
});

describe("Test suite for marker information ui component", () => {

    let renderedOutput;

    beforeEach(() => {

        var markerInfoProps = {
            renderedOn: Date.now(),
            markerInformation: {
                Initials: "A",
                Surname: "Vinod",
                ApprovalStatus: 4,
                MarkerRoleID: 1,
                SupervisorInitials: "A",
                SupervisorSurname: "Kumar"
            }
        };

        var markerInformationComponent = React.createElement(MarkerInformationPanel, markerInfoProps);
        renderedOutput = ReactTestUtils.renderIntoDocument(markerInformationComponent);
    });

    it("Tests whether the marker information component loads correctly", () => {
        expect(renderedOutput).not.toBeNull();
    });
});