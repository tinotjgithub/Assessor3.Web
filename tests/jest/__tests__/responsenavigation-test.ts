jest.dontMock("../../../src/components/response/responsenavigation");

import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import ResponseNavigation = require("../../../src/components/response/responsenavigation");
var localeJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localeAction = require("../../../src/actions/locale/localeaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import markerInformationAction = require("../../../src/actions/markerinformation/markerinformationaction");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import Immutable = require("immutable");
import enums = require("../../../src/components/utility/enums");
import responseOpenAction = require("../../../src/actions/response/responseopenaction");
import tagGetAction = require("../../../src/actions/tag/taggetaction");

describe("Check Response Navigation in response screen header", () => {
    var responseLiveOpenData: WorklistBase;

    beforeEach(() => {
        // Set the default locale
        dispatcher.dispatch(new localeAction(true, "en-GB", localeJson));

        /*live open response list object */
        var liveOpenResponses = {
            "responses":
            [
                {
                    "displayId": "6370108",
                    "markingProgress": 2,
                    "allocatedDate": "2016-01-18T11:44:59.61",
                    "updatedDate": "2016-01-18T11:44:59.617",
                    "hasAllPagesAnnotated": false,
                    "totalMarkValue": 2,
                    "hasBlockingExceptions": false,
                    "exceptionsCount": 0,
                    "tagId":5
                }

            ],
            "concurrentLimit": 5,
            "maximumMark": 50,
            "unallocatedResponsesCount": 18,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        let markerInfo = {
            "initials": "AA",
            "surname": "BB",
            "approvalStatus": 2,
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

        let ccData = {
            "configurableCharacteristics": [{
                "ccName": "HasGracePeriod",
                "ccValue": "true",
                "valueType": 1,
                "markSchemeGroupID": 28,
                "questionPaperID": 0,
                "examSessionID": 0
            },
                {
                    "ccName": "StringFormat",
                    "ccValue": "<StringFormat><OverviewQIGName>{QIGName}-{AssessmentIdentifier}</OverviewQIGName><Username>{Initials} {Surname}</Username></StringFormat>",
                    "valueType": 5,
                    "markSchemeGroupID": 28,
                    "questionPaperID": 0,
                    "examSessionID": 0
                },
                {
                    "ccName": "ColouredAnnotations",
                    "ccValue": "<ColouredAnnotation Status=\"On\" DefaultColour=\"#FFFF0000\"/>",
                    "valueType": 5,
                    "markSchemeGroupID": 28,
                    "questionPaperID": 0,
                    "examSessionID": 0
                }
            ],
            "success": true,
            "errorMessage": null
        }

        let overviewData: overviewData;

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

        let tagList = {
            "tagList": [
                {
                    "tadId": 1,
                    "tagName": "Tag1"
                },
                {
                    "tadId": 2,
                    "tagName": "Tag2"
                }
            ]
        };

        overviewData = JSON.parse(JSON.stringify(qigList));
        overviewData.qigSummary = Immutable.List(overviewData.qigSummary);

        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, overviewData));
        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));
        dispatcher.dispatch(new markerInformationAction(true, markerInfo));

        /* Creating immutable collection for live open */
        var liveOpenResponsesString = JSON.stringify(liveOpenResponses);
        responseLiveOpenData = JSON.parse(liveOpenResponsesString);
        var immutableList = Immutable.List(responseLiveOpenData.responses);
        responseLiveOpenData.responses = immutableList;

        dispatcher.dispatch(new responseOpenAction(true, 6370108, enums.ResponseNavigation.first,
            enums.ResponseMode.open,50,enums.ResponseViewMode.none,enums.TriggerPoint.None,null,1,1));

        dispatcher.dispatch(new tagGetAction(true, JSON.parse(JSON.stringify(tagList))));
    });

    let renderedOutput;
    it("check left and right navigation button visibility", () => {

        let responsenavigationProps = {
            responseId: "123",
            currentResponse: 1,
            totalResponses: 5,
            isPreviousResponseAvailable: true,
            isNextResponseAvailable: true,
            moveCallback: null
        }

        var responsenavigationComponent = react.createElement(ResponseNavigation, responsenavigationProps);
        renderedOutput = reactTestUtils.renderIntoDocument(responsenavigationComponent);

        var leftnavigationbutton = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'response-nav response-nav-prev');
        expect(leftnavigationbutton).not.toBeNull();

        var rightnavigationbutton = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'response-nav response-nav-next');
        expect(rightnavigationbutton).not.toBeNull();
    });

    it("check left navigation not visibile", () => {
        let responsenavigationProps = {
            responseId: "123",
            currentResponse: 1,
            totalResponses: 5,
            isPreviousResponseAvailable: false,
            isNextResponseAvailable: true,
            moveCallback: null
        }

        var responsenavigationComponent = react.createElement(ResponseNavigation, responsenavigationProps);
        renderedOutput = reactTestUtils.renderIntoDocument(responsenavigationComponent);

        var leftnavigationbutton = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'response-nav response-nav-prev');
        expect(leftnavigationbutton.length).toEqual(0);

        var rightnavigationbutton = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'response-nav response-nav-next');
        expect(rightnavigationbutton).not.toBeNull();
    });

    it("check right navigation not visibile", () => {
        let responsenavigationProps = {
            responseId: "123",
            currentResponse: 1,
            totalResponses: 5,
            isPreviousResponseAvailable: true,
            isNextResponseAvailable: false,
            moveCallback: null
        }

        var responsenavigationComponent = react.createElement(ResponseNavigation, responsenavigationProps);
        renderedOutput = reactTestUtils.renderIntoDocument(responsenavigationComponent);

        var leftnavigationbutton = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'response-nav response-nav-prev');
        expect(leftnavigationbutton).not.toBeNull();

        var rightnavigationbutton = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'response-nav response-nav-next');
        expect(rightnavigationbutton.length).toEqual(0);
    });

    it("check response navigation position text", () => {
        let responsenavigationProps = {
            responseId: "123",
            currentResponse: 1,
            totalResponses: 5,
            isPreviousResponseAvailable: true,
            isNextResponseAvailable: false,
            moveCallback: null
        }
        var responsenavigationComponent = react.createElement(ResponseNavigation, responsenavigationProps);
        renderedOutput = reactTestUtils.renderIntoDocument(responsenavigationComponent);

        var responsepositionDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "response-position");
        expect(responsepositionDOMElement.textContent.trim()).toContain("1");
        expect(responsepositionDOMElement.textContent.trim()).toContain("5");
    });
});