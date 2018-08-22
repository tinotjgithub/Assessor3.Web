
jest.dontMock("../../../src/components/utility/grid/gridcontrol");
jest.dontMock("../../../src/components/worklist/worklisttablewrapper");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import GridControl = require("../../../src/components/utility/grid/gridcontrol");
import liveworkListHelper = require("../../../src/components/utility/grid/worklisthelpers/liveworklisthelper");
import workListHelperBase = require("../../../src/components/utility/grid/worklisthelpers/worklisthelperBase");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import localStore = require("../../../src/stores/localestore");
var localJson = require("../../../content/resources/rm-en.json");
const List = require("../../../src/components/utility/grid/gridcontrol").default;
import enums = require("../../../src/components/utility/enums");
import markerInformationAction = require("../../../src/actions/markerinformation/markerinformationaction");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import WorklistTableWrapper = require('../../../src/components/worklist/worklisttablewrapper');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import markerOperationModeChangedAction = require('../../../src/actions/userinfo/markeroperationmodechangedaction');
import tagGetAction = require('../../../src/actions/tag/taggetaction');

describe("Test suite for Team Management view live worklist grid", function () {

    var gridRowsLiveOpenDetail: Immutable.List<Row>;
    var gridRowsLiveOpenTile: Immutable.List<Row>;
    var gridRowsLiveClosedDetail: Immutable.List<Row>;
    var gridRowsLiveClosedTile: Immutable.List<Row>;
    var gridRowsPendingDetail: Immutable.List<Row>;
    var gridRowsPendingTile: Immutable.List<Row>;
    var teamManagementViewLiveOpenResponseData: WorklistBase;
    var responseLiveClosedData: WorklistBase;
    var responseLiveGraceData: WorklistBase;
    let _gridRows = null;
    let _gridColumnHeaderRows = null;
    let _gridFrozenBodyRows = null;
    let _gridFrozenHeaderRows = null;

    var propsCols = {};

    var mockFn = {
        toLocaleDateString: jest.genMockFunction().mockImplementation(function (val: Date) {
            // do something stateful
            return val.toLocaleDateString();
        });
    };

    var getId = function () {
        return 'live_open_grid_1';
    };

    var loadData = (workListType: enums.WorklistType, responseMode: enums.ResponseMode) => {

        let data: any;
        let gridType: enums.GridType = enums.GridType.detailed;

        switch (responseMode) {
            case enums.ResponseMode.open:
                data = teamManagementViewLiveOpenResponseData;
                break;
            case enums.ResponseMode.pending:
                data = responseLiveGraceData;
                break;
            case enums.ResponseMode.closed:
                data = responseLiveClosedData;
                break;
        }

        let helper: workListHelperBase = new liveworkListHelper();
        _gridRows = helper.generateRowDefinion(data, responseMode, gridType);
        _gridColumnHeaderRows = helper.generateTableHeader(responseMode, workListType, '', enums.SortDirection.Ascending);
        _gridFrozenBodyRows = helper.generateFrozenRowBody(data, responseMode, workListType);
        _gridFrozenHeaderRows = helper.generateFrozenRowHeader(data, responseMode, workListType, '', enums.SortDirection.Ascending);

        propsCols = {
            gridRows: _gridRows,
            selectedLanguage: "en-GB",
            columnHeaderRows: _gridColumnHeaderRows,
            frozenHeaderRows: _gridFrozenHeaderRows,
            frozenBodyRows: _gridFrozenBodyRows,
            worklistType: enums.WorklistType.live,
            getGridControlId: getId,
            id: 'DetailedView1',
            key: 'DetailedViewKey1'
        };
    };

    beforeEach(() => {
        dispatcher.dispatch(new localAction(true, "en-GB", localJson));
        var liveWorkListHelper: workListHelper;

        let tagLists = {
            "tagList": [{
                "tagId": "1",
                "tagName": "Orange",
                "tagOrder": "5"
            },
            {
                "tagId": "2",
                "tagName": "Blue",
                "tagOrder": "2"
            },
            {
                "tagId": "3",
                "tagName": "Green",
                "tagOrder": "3"
            }]
        };

        let tagLists: TagData = JSON.parse(JSON.stringify(tagLists));
        dispatcher.dispatch(new tagGetAction(true, tagLists));

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
                    "seedTypeId": 15,
                    "tagId": 6,
                    "tagOrder": 1
                }

            ],
            "concurrentLimit": 5,
            "maximumMark": 50,
            "unallocatedResponsesCount": 18,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        /*live closed response list object */
        var liveClosedResponses = {
            "responses":
            [
                {
                    "submittedDate": "2017-02-17T03:40:20.853Z",
                    "seedTypeId": 15,
                    "qualityFeedbackStatusId": 2,
                    "markGroupId": 32405,
                    "displayId": "6256624",
                    "hasAllPagesAnnotated": true,
                    "totalMarkValue": 5,
                    "hasBlockingExceptions": false,
                    "resolvedExceptionsCount": 0,
                    "hasMessages": false,
                    "unreadMessagesCount": 0,
                    "hasExceptions": false,
                    "hasAdditionalObjects": false,
                    "candidateScriptId": 26314,
                    "documentId": 17124,
                    "accuracyIndicatorTypeID": 51,
                    "absoluteMarksDifference": 20,
                    "totalMarksDifference": 10,
                    "baseColor": null,
                    "startWithEmptyMarkGroup": null,
                    "showOriginalMarkerName": null,
                    "originalMarkerInitials": null,
                    "originalMarkerSurname": null,
                    "centreNumber": null,
                    "centreCandidateNumber": null,
                    "markChangeReasonVisible": null,
                    "markChangeReason": null,
                    "tagId": 6,
                    "tagOrder": 1
                }

            ],
            "maximumMark": 1,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        /*live in grace response list object */
        var liveInGraceResponses = {
            "responses":
            [
                {
                    "displayId": "6370109",
                    "lastUpdatedDate": "2016-02-25T08:07:18.247",
                    "hasAllPagesAnnotated": true,
                    "totalMarkValue": 2,
                    "hasBlockingExceptions": false,
                    "resolvedExceptionsCount": 2,
                    "hasMessages": true,
                    "unreadMessagesCount": 2,
                    "hasExceptions": true,
                    "hasAdditionalObjects": true,
                    "timeToEndOfGracePeriod": 5,
                    "tagId": 6,
                    "tagOrder": 1
                }

            ],
            "maximumMark": 50,
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

        overviewData = JSON.parse(JSON.stringify(qigList));
        overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.TeamManagement, false));
        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, overviewData));
        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));
        dispatcher.dispatch(new markerInformationAction(true, markerInfo));


        /* Creating immutable collection for live open team management view */
        var liveOpenResponsesString = JSON.stringify(liveOpenResponses);
        teamManagementViewLiveOpenResponseData = JSON.parse(liveOpenResponsesString);
        var immutableList = Immutable.List(teamManagementViewLiveOpenResponseData.responses);
        teamManagementViewLiveOpenResponseData.responses = immutableList;

        /* Creating immutable collection for live closed */
        var liveClosedResponsesString = JSON.stringify(liveClosedResponses);
        responseLiveClosedData = JSON.parse(liveClosedResponsesString);
        var immutableList = Immutable.List(responseLiveClosedData.responses);
        responseLiveClosedData.responses = immutableList;

        var livePendingResponsesString = JSON.stringify(liveInGraceResponses);
        responseLiveGraceData = JSON.parse(livePendingResponsesString);
        var immutableList = Immutable.List(responseLiveGraceData.responses);
        responseLiveGraceData.responses = immutableList;

        let workListHelper: workListHelperBase = new liveworkListHelper();

        /* Generating row definition for live open */
        gridRowsLiveOpenDetail = workListHelper.generateRowDefinion(teamManagementViewLiveOpenResponseData,
            enums.ResponseMode.open,
            enums.GridType.detailed);

        /* Generating row definition for live closed */
        gridRowsLiveClosedDetail = workListHelper.generateRowDefinion(responseLiveClosedData,
            enums.ResponseMode.closed,
            enums.GridType.detailed);

        /* Generating row definition for live in grace */
        gridRowsPendingDetail = workListHelper.generateRowDefinion(responseLiveGraceData,
            enums.ResponseMode.pending,
            enums.GridType.detailed);

    });

    /* will check whether seed label is displaying in TeamManagement open worklist */
    it('will check whether the seed label is displaying in TeamManagement open worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[9];
        expect(column.className).toBe('col-seed');
        expect(column.textContent.trim()).toBe('Seed');
    });

    /* will check whether seed label is displaying in TeamManagement closed worklist */
    it('will check whether the seed label is displaying in TeamManagement closed worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[8];
        expect(column.className).toBe('col-seed');
        expect(column.textContent.trim()).toBe('Seed');
    });

    /* will check whether the accuaracy indicator is displaying in team management closed worklist */
    it('will check whether the accuaracy indicator is displaying in TeamManagement closed worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[1];
        expect(column.className).toBe('col-accuracy');
        expect(column.textContent.trim()).toBe('Inaccurate');
    });

    /* will check whether the absolute difference is displaying in team management closed worklist */
    it('will check whether the absolute difference is displaying in TeamManagement closed worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[2];
        expect(column.className).toBe('col-amd');
        expect(column.textContent.trim()).toBe('20');
    });

    /* will check whether the total difference is displaying in team management view */
    it('will check whether the total difference is displaying in TeamManagement closed worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[3];
        expect(column.className).toBe('col-tmd');
        expect(column.textContent.trim()).toBe('+10');
    });

    /* will check whether tag is displaying in TeamManagement open worklist */
    it('will check whether the tag is displaying in TeamManagement open worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[7];
        expect(column.className).toBe('col-tag');
    });

    /* will check whether tag is displaying in TeamManagement open worklist */
    it('will check whether the tag is displaying in TeamManagement closed worklist', () => {
        loadData(enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[7];
        expect(column.className).toBe('col-tag');
    });
});