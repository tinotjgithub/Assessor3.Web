jest.dontMock("../../../src/components/qigselector/qigselector");

import React = require("react");
import ReactTestUtils = require('react-dom/test-utils');
import QigSelector = require("../../../src/components/qigselector/qigselector");
import OverviewData = require("../../../src/stores/qigselector/overviewdata");
import Immutable = require("immutable");

describe("Test suite for qigselector ui component", () => {

    let renderedOutput;
    let overviewData: OverviewData;

    let qigList = {
        "qigSummary": [
            {
                "examinerRole": 1471,
                "markSchemeGroupId": 186,
                "markSchemeGroupName": "PHIL2 Whole Paper",
                "questionPaperName": "AQAMATH",
                "examinerApprovalStatus": 1,
                "questionPaperPartId": 196,
                "assessmentCode": "AQAM1",
                "componentId": "AQAM1               ",
                "sessionId": 7,
                "sessionName": "2013 July (Non-live Pilot)",
                "isESTDEnabled": true,
                "standardisationSetupComplete": false,
                "isESTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": true,
                "hasSTMSimulationMode": false,
                "isMarkFromPaper": false,
                "inSimulationMode": true,
                "status": 10,
                "currentMarkingTarget": {
                    "markingMode": 90,
                    "markingCompletionDate": "1753-01-01T00:00:00",
                    "maximumMarkingLimit": 9999,
                    "remarkRequestType": 0,
                    "submittedResponsesCount": 0,
                    "openResponsesCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0
                },
                "markingTargets": [
                    {
                        "markingMode": 2,
                        "markingCompletionDate": "2013-09-13T23:59:00.59",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 3,
                        "markingCompletionDate": "2013-09-15T23:59:00.59",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 30,
                        "markingCompletionDate": "2013-09-20T18:14:03.52",
                        "maximumMarkingLimit": 100,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    }
                ]
            },
            {
                "examinerRole": 1481,
                "markschemeGroupId": 189,
                "markschemeGroupName": "PHIL2 Whole Paper",
                "questionPaperName": "X An Introduction to Philosophy 2",
                "examinerApprovalStatus": 1,
                "questionPaperPartId": 200,
                "assessmentCode": "PHIL2016E",
                "componentId": "16E                 ",
                "sessionId": 12,
                "sessionName": "2013 July (Non-live Pilot)",
                "isEStDEnabled": true,
                "standardisationSetupComplete": false,
                "isESteamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": true,
                "hasStMSimulationMode": false,
                "isMarkFromPaper": false,
                "inSimulationMode": true,
                "status": 10,
                "currentMarkingTarget": {
                    "markingMode": 90,
                    "markingCompletionDate": "1753-01-01T00:00:00",
                    "maximumMarkingLimit": 9999,
                    "remarkRequestType": 0,
                    "submittedResponsesCount": 0,
                    "openResponsesCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0
                },
                "markingTargets": [
                    {
                        "markingMode": 2,
                        "markingCompletionDate": "2013-09-13T23:59:00.59",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 3,
                        "markingCompletionDate": "2013-09-15T23:59:00.59",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 30,
                        "markingCompletionDate": "2013-09-20T18:14:03.52",
                        "maximumMarkingLimit": 20,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    }
                ]
            },
            {
                "examinerRole": 1491,
                "markschemeGroupId": 190,
                "markschemeGroupName": "PHIL2 Whole Paper",
                "questionPaperName": "X An Introduction to Philosophy 2",
                "examinerApprovalStatus": 1,
                "questionPaperPartId": 202,
                "assessmentCode": "RE",
                "componentId": "PH                  ",
                "sessionId": 19,
                "sessionName": "2013 July (Non-live Pilot)",
                "isEStDEnabled": true,
                "standardisationSetupComplete": false,
                "isESteamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": true,
                "hasStMSimulationMode": false,
                "isMarkFromPaper": false,
                "inSimulationMode": true,
                "status": 10,
                "currentMarkingTarget": {
                    "markingMode": 90,
                    "markingCompletionDate": "1753-01-01T00:00:00",
                    "maximumMarkingLimit": 9999,
                    "remarkRequestType": 0,
                    "submittedResponsesCount": 0,
                    "openResponsesCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": false,
                    "markingProgress": 0
                },
                "markingTargets": [
                    {
                        "markingMode": 2,
                        "markingCompletionDate": "2013-09-13T23:59:00.59",
                        "maximumMarkingLimit": 2,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 3,
                        "markingCompletionDate": "2013-09-15T23:59:00.59",
                        "maximumMarkingLimit": 3,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 30,
                        "markingCompletionDate": "2013-09-20T18:14:03.52",
                        "maximumMarkingLimit": 100,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    }
                ]
            },
            {
                "examinerRole": 1501,
                "markSchemeGroupId": 191,
                "markSchemeGroupName": "AQA UNSTRUCT Paper",
                "questionPaperName": "X An Introduction to PhilosophySJ",
                "examinerApprovalStatus": 1,
                "questionPaperPartId": 203,
                "assessmentCode": "AQA UNSTRUCT",
                "componentId": "19                  ",
                "sessionId": 13,
                "sessionName": "MARCH2015",
                "isESTDEnabled": true,
                "standardisationSetupComplete": false,
                "isESTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": true,
                "hasSTMSimulationMode": false,
                "isMarkFromPaper": false,
                "inSimulationMode": true,
                "status": 10,
                "currentMarkingTarget": {
                    "markingMode": 90,
                    "markingCompletionDate": "1753-01-01T00:00:00",
                    "maximumMarkingLimit": 9999,
                    "remarkRequestType": 0,
                    "submittedResponsesCount": 0,
                    "openResponsesCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0
                },
                "markingTargets": [
                    {
                        "markingMode": 2,
                        "markingCompletionDate": "2013-09-13T23:59:00.59",
                        "maximumMarkingLimit": 2,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 3,
                        "markingCompletionDate": "2013-09-15T23:59:00.59",
                        "maximumMarkingLimit": 3,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 30,
                        "markingCompletionDate": "2013-09-20T18:14:03.52",
                        "maximumMarkingLimit": 100,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    }
                ]
            },
            {
                "examinerRole": 1418,
                "markSchemeGroupId": 176,
                "markSchemeGroupName": "PHIL8 Whole Paper",
                "questionPaperName": "X An Introduction to Philosophy 2",
                "examinerApprovalStatus": 4,
                "questionPaperPartId": 180,
                "assessmentCode": "PHIL8",
                "componentId": "02                  ",
                "sessionId": 2,
                "sessionName": "2013 July (Non-live Pilot)",
                "isESTDEnabled": true,
                "standardisationSetupComplete": true,
                "isESTeamMember": true,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": true,
                "hasSTMSimulationMode": false,
                "isMarkFromPaper": false,
                "inSimulationMode": false,
                "status": 7,
                "currentMarkingTarget": {
                    "markingMode": 30,
                    "markingCompletionDate": "2016-01-10T00:00:00",
                    "maximumMarkingLimit": 100,
                    "remarkRequestType": 0,
                    "submittedResponsesCount": 0,
                    "openResponsesCount": 1,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": false,
                    "markingProgress": 0
                },
                "markingTargets": [
                    {
                        "markingMode": 4,
                        "markingCompletionDate": "2013-09-15T17:35:54.243",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 1,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 100
                    },
                    {
                        "markingMode": 30,
                        "markingCompletionDate": "2016-01-10T00:00:00",
                        "maximumMarkingLimit": 100,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 1,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": true,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    }
                ]
            }
        ],
        "success": true,
        "errorMessage": null
    };

    beforeEach(() => {
        overviewData = JSON.parse(JSON.stringify(qigList));
        overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
        renderedOutput = ReactTestUtils.renderIntoDocument(React.createElement(QigSelector));
    });

    it("Tests whether the component renders correctly", () => {
        expect(renderedOutput).not.toBe(null);
    });

    it("Tests if loading indicator is shown correctly", () => {
        var loadingIndicator = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "qig-loader loading");
        expect(loadingIndicator).not.toBe(null);
    });

    it(("Tests whether class changes when expand/collapse button is clicked"), () => {
        var input = ReactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "dropdown-wrap open header-dropdown")[0];
        var menuButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "menu-button")[0];

        /** menu button should be undefined for the first time as we were not showing the drop down first. */
        expect(menuButton).toBe(undefined);

        input = ReactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "dropdown-wrap close header-dropdown")[0];
        expect(input).not.toBe(null);

        var qigMenu = ReactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "menu qig-menu")[0];
        expect(qigMenu).not.toBe(null);
    });

    it(("will check whether rendered component is React Component"), () => {
        expect(ReactTestUtils.isCompositeComponent(renderedOutput)).toBeTruthy();
        expect(ReactTestUtils.isDOMComponent(renderedOutput)).not.toBeTruthy();
        expect(ReactTestUtils.isCompositeComponentWithType(renderedOutput, QigSelector)).toBeTruthy();
    });

    it(("will check state of qig selector"), () => {
        var scryReactComponent = ReactTestUtils.scryRenderedComponentsWithType(renderedOutput, QigSelector)[0];
        expect(scryReactComponent).not.toBeNull();
        expect(scryReactComponent).not.toBeUndefined();

        scryReactComponent.state.isOpen = true;
        scryReactComponent.state.qigs = overviewData.qigSummary;

        expect(scryReactComponent.state.qigs).not.toBeNull();
        expect(scryReactComponent.state.qigs.size).toBe(5);
        expect(scryReactComponent.state.isOpen).toBe(true);

        scryReactComponent.setState({ isOpen: true, qigs: null });
        expect(scryReactComponent.state.qigs).toBeNull();
        expect(scryReactComponent.state.isOpen).toBe(true);
    });
});